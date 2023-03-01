import {
  cleanupField,
  getLowestConcurrencyLimit,
  handleConcurrentCalls,
  identifyProcessingDependencies,
  formatErrorMessage,
} from "../BulkUtils";

/**
 * Selected Templates is an array of templates to be processed on a bulk upload.
 * @param checked boolean to represent if a template should be added or removed from the array of selected templates
 * @param template the template to be added or removed
 * @param selectedTemplates the current list of selected templates
 * @param setSelectedTemplates React.useState hook to update the selectedTemplates
 */
export const updateSelectedTemplates = (checked: boolean, template: any, selectedTemplates: any, setSelectedTemplates: any): void => {
  const templates = selectedTemplates.slice();
  const templateFound = templates.some((t: any) => t.name === template.name);

  if(checked && !templateFound) {
    templates.push(template);
    setSelectedTemplates(templates);
  } else if(!checked && templateFound) {
    setSelectedTemplates(templates.filter((t: any) => t.name !== template.name));
  }
};

/**
 * Maps through all of the selected templates to generate a complete list of fields to validate with no duplicates.
 * @param selectedTemplates the current list of selected templates
 * @param setConsolidatedTemplates React.useState hook to update the consolidated spreadsheets
 */
export const consolidateTemplates = (selectedTemplates: any, setConsolidatedTemplates: any): void => {
  const beginningArray: any = [];
  let templates = selectedTemplates;
  const templateTree = identifyProcessingDependencies(selectedTemplates);
  if(templateTree){
    templates = templateTree;
  }
  templates.forEach((t: any) => beginningArray.push(...t.fields));
  const consolidatedFieldsList: any = [];
  beginningArray.forEach((bt: any) => {
    const duplicateField = consolidatedFieldsList.some((field: any) => field.field === bt.field);
    if(!duplicateField){
      consolidatedFieldsList.push(bt);
    }
  });
  setConsolidatedTemplates(consolidatedFieldsList);
};

/**
 * Loops through each row in the uploaded form and processes field validations on each row given the
 * consolidated fields list.
 * @param uploadedForm Original uploaded form to be validated
 * @param selectedTemplates selected Templates which stores the validation concurreny limits
 * @param consolidatedFieldsList consolidated list of fields to process validation functions
 * @param setProcessedRows React.useState hook to update the number of processed rows that drive the progress bar
 * @param state State as of the time the application loaded

*/
export const performValidations = async (
  uploadedForm: any,
  selectedTemplates: any,
  consolidatedFieldsList: any,
  setProcessedRows: any,
  state: any
): Promise<any> => {
  const finalErrors: any = [];
  let validationPromises;
  const concurrencyLimit: any = getLowestConcurrencyLimit(selectedTemplates, "validation");

  const processValidationsOnRows = async (row: any, progressCallback: any): Promise<any> => {
    const fieldPromises = await Promise.allSettled(consolidatedFieldsList.map((field: any) => {
      return field.validateFunction(row, state);
    }));
    progressCallback((previousCount: number) => (previousCount + 1));
    return fieldPromises;
  };

  if(concurrencyLimit){
    validationPromises = await handleConcurrentCalls(concurrencyLimit, processValidationsOnRows, uploadedForm, setProcessedRows);
  } else {
    validationPromises = await Promise.allSettled(uploadedForm.map(async (row: any) => {
      return processValidationsOnRows(row, setProcessedRows);
    }));
  }

  console.log("***performValidations results: ", validationPromises);
  validationPromises.forEach((rowPromise: any) => {
    let rowNumber: any;
    const rowErrors: any = [];
    rowPromise.value.map((fieldPromise: any) => {
      if(fieldPromise.status === "rejected"){
        const reason = JSON.parse(fieldPromise.reason);
        const error = reason.error || reason;
        if(!rowNumber){
          rowNumber = JSON.parse(fieldPromise.reason).rowNumber;
        }
        rowErrors.push(error);
      }
    });

    if(rowErrors.length !== 0){
      finalErrors.push({
        rowNumber,
        errors: rowErrors
      });
    }
  });

  if(finalErrors.length === 0){
    return Promise.resolve();
  } else {
    return Promise.reject(finalErrors);
  }
};

/**
 * Checks to see if there are any records in the calabrio users state with conflicting information that would cause 
 * an error to be thrown in creating a Calabrio user 
 * @param user user being checked
 * @param rowNumber rowNumber being processed for alignment of promise rejection comments
 * @param users list of available Calabrio users in the state
 */
export const checkConflictingCalabrioUsers = async (user: any, rowNumber: number, users: any[]): Promise<any> => {
  if(user){
    try {
      const acdId = user.workerSid ? cleanupField(user.workerSid, "string") : null;
      const email = cleanupField(user.email, "string");
      const adLogin = cleanupField(user.adLogin, "string");

      await Promise.all(users.map(async u => {
        const dupUserAcdId = cleanupField(u.acdId, "string");
        const dupUserAdLogin = cleanupField(u.adLogin, "string");
        const dupUserEmail = cleanupField(u.email, "string");

        if (acdId && dupUserAcdId === acdId) {
          console.log("CALABRIO CONFLICTING USERS: ", acdId, dupUserAcdId);
          throw(`Calabrio Record already exists with this user's acdId for row ${rowNumber}.`);
        }

        if (adLogin && dupUserAdLogin === adLogin) {
          console.log("CALABRIO CONFLICTING USERS: ", dupUserAdLogin, adLogin);
          throw(`Calabrio Record already exists with this user's nNumber in the AdLogin field for row ${rowNumber}.`);
        }

        if (email && dupUserEmail === email) {
          console.log("CALABRIO CONFLICTING USERS: ", dupUserEmail, email);
          throw(`Calabrio Record already exists with this user's email for row ${rowNumber}.`);
        }
      }));
      return Promise.resolve(`Calabrio Checks passed for ${rowNumber}`);
    } catch(err) {
      console.error("Error thrown trying to fetch and validate Conflicting Users", err);
      return Promise.reject(JSON.stringify({
        rowNumber: rowNumber,
        error: formatErrorMessage(err)
      }));
    }
  } else {
    return Promise.reject(JSON.stringify({
      rowNumber: rowNumber,
      error: "No user passed to calabrio processing"
    }));
  }
};