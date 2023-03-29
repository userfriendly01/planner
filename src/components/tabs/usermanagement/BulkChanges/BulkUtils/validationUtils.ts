import {
  cleanupField,
  getLowestConcurrencyLimit,
  handleConcurrentCalls,
  identifyProcessingDependencies,
  formatErrorMessage
} from "../BulkUtils";
import { FIELDS } from "../BulkTemplates/fields";

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

/**
 * Checks to see if there are any records in the calabrio wfm people state with conflicting information that would cause 
 * an error to be thrown in creating a Calabrio WFM person 
 * @param user user being checked (the row)
 * @param rowNumber rowNumber being processed for alignment of promise rejection comments
 * @param wfmOrgs WFM Org in the state containing all People state
 */
export const checkConflictingWFMPeople = (user: any, rowNumber: number, wfmOrgs: any[]): boolean => {
  if(user){
    try {
      const nNumber = cleanupField(user.attributes.n_number, "string");
      const email = cleanupField(user.email, "string");

      // create an array of all WFM people to use for comparison
      const people = wfmOrgs[0].People_Without_Team;
      console.log("LOOK", people);
      wfmOrgs.forEach(bu => {
        bu.Teams.forEach((team: any) => {
          people.push(...team.People);
        });
      });

      let hasConflict = false;

      for (let i = 0; i <= people.length; i++) {
        const dupUserNNumber = cleanupField(people[i].EmploymentNumber, "string");
        const dupUserEmail = cleanupField(people[i].Email, "string");

        if (nNumber && dupUserNNumber === nNumber) {
          console.log("CALABRIO WFM CONFLICTING USERS: ", dupUserNNumber, nNumber);
          hasConflict = true;
          break;
        }

        if (email && dupUserEmail === email) {
          console.log("CALABRIO WFM CONFLICTING USERS: ", dupUserEmail, email);
          hasConflict = true;
          break;
        }
      }
      return hasConflict;
      // // TODO: NEED TO FIX THIS... do we need the resolve rejects??? I think we can just return true or false...
      // people.map(async (p: any) => {
      //   const dupUserNNumber = cleanupField(p.EmploymentNumber, "string");
      //   const dupUserEmail = cleanupField(p.Email, "string");

      //   if (nNumber && dupUserNNumber === nNumber) {
      //     console.log("CALABRIO WFM CONFLICTING USERS: ", dupUserNNumber, nNumber);
      //     throw(`Calabrio WFM Record already exists with this user's nNumber in the EmploymentNumber field for row ${rowNumber}.`);
      //   }

      //   if (email && dupUserEmail === email) {
      //     console.log("CALABRIO WFM CONFLICTING USERS: ", dupUserEmail, email);
      //     throw(`Calabrio WFM Record already exists with this user's email for row ${rowNumber}.`);
      //   }
      // });
      // return Promise.resolve(`Calabrio WFM Checks passed for ${rowNumber}`);
    } catch(err) {
      console.error("Error thrown trying to fetch and validate Conflicting Users", err);
      // return Promise.reject(JSON.stringify({
      //   rowNumber: rowNumber,
      //   error: formatErrorMessage(err)
      // }));
    }
  } else {
    // return Promise.reject(JSON.stringify({
    //   rowNumber: rowNumber,
    //   error: "No user passed to calabrio wfm processing"
    // }));
  }
};

/**
 * Checks to see if a wfm field related to scheduling is allowed to be empty.  There are some fields pertaining to scheduling with WFM that 
 * either all need to be empty, or all need to have a value.  This function will check a particular field name against the others
 * to determine if the value is required
 * @param row row to check
 * @param fieldName the fieldname that has been determined to be empty
 */
export const allowedEmptyScheduleField = (row: any, fieldName: string) => {
  const allOrNothingFields = [ // if one of these fields is provided, then ALL of these fields must be provided
    FIELDS.CALABRIO_WFM_PERSON_START_DATE.name,
    FIELDS.CALABRIO_WFM_TEAM.name,
    FIELDS.CALABRIO_WFM_TEAM_START_DATE.name,
    FIELDS.CALABRIO_WFM_CONTRACT.name,
    FIELDS.CALABRIO_WFM_CONTRACT_SCHEDULE.name,
    FIELDS.CALABRIO_WFM_PARTTIME_PERCENTAGE.name
  ];
  const optionalScheduleFields = [
    FIELDS.CALABRIO_WFM_SHIFTBAG.name,
    FIELDS.CALABRIO_WFM_BUDGET_GROUP.name
  ];
// TODO: Check this logic more...
  const fieldIsOptional = optionalScheduleFields.includes(fieldName);
  if (fieldIsOptional) {
    console.log("this field is totally optional, allowed to be empty");
    return true;
  } else {
    let isValid = true;
    allOrNothingFields.forEach((field: string) => {
      if (row[field]) {
        console.log("%%%% INVALID.  FIELD CANNOT BE EMPTY due to the following field being populated:", fieldName);
        isValid = false;
      }
    });

    return isValid;
  }
};