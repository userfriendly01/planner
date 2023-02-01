import {
  cleanupField,
  getLowestConcurrencyLimit,
  handleConcurrentCalls
} from "../BulkUtils";

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

  const processValidationsOnRows = async (row: any, rowIndex: number, progressCallback: any): Promise<any> => {
    const fieldPromises = await Promise.allSettled(consolidatedFieldsList.map((field: any) => {
      return field.validateFunction(row, rowIndex, state);
    }));
    progressCallback((previousCount: number) => (previousCount + 1));
    return fieldPromises;
  };

  if(concurrencyLimit){
    validationPromises = await handleConcurrentCalls(concurrencyLimit, processValidationsOnRows, uploadedForm, setProcessedRows);
  } else {
    validationPromises = await Promise.allSettled(uploadedForm.map(async (row: any, index: number) => {
      const rowNumber = index + 2;
      return processValidationsOnRows(row, rowNumber, setProcessedRows);
    }));
  }

  console.log("***performValidations results: ", validationPromises);
  validationPromises.forEach((rowPromise: any, index: number) => {
    const rowErrors: any = [];
    rowPromise.value.map((fieldPromise: any) => {
      if(fieldPromise.status === "rejected"){
        rowErrors.push(fieldPromise.reason);
      }
    });
    if(rowErrors.length !== 0){
      finalErrors.push({
        row: index + 2, //When original spreadsheet has header this is 2 vs 1
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
          Promise.reject(`Calabrio Record already exists with this user's acdId for row ${rowNumber}`);
        }

        if (dupUserAdLogin === adLogin) {
          console.log("CALABRIO CONFLICTING USERS: ", dupUserAdLogin, adLogin);
          Promise.reject(`Calabrio Record already exists with this user's nNumber in the AdLogin field for row ${rowNumber}.`);
        }

        if (dupUserEmail === email) {
          console.log("CALABRIO CONFLICTING USERS: ", dupUserEmail, email);
          Promise.reject(`Calabrio Record already exists with this user's email for row ${rowNumber}.`);
        }
      }));
      return Promise.resolve(`Calabrio Checks passed for ${rowNumber}`);
    } catch(err) {
      console.error("Error thrown trying to fetch and validate Conflicting Users", err);
      return Promise.reject(err);
    }
  } else {
    return Promise.reject("No user passed to calabrio processing");
  }
};