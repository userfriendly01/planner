import {
  AppState,
  WfmBusinessUnit
} from "globals/interfaces";
import { getCalabrioUsers } from "services/calabrio";
import { listUMManagers } from "services/manager";
import { wfmActivateExternalLogon } from "services/wfmActivateExternalLogon";
import {
  UploadedRow,
  Template
} from "../BulkChanges.Interfaces";
import { getCalabrioWfmOrg } from "utils/calabrioUtils";
import { logger } from "utils/logger";
import * as XLSX from "xlsx";

/**
 * Refreshes the calabrio user state after a bulk update on users
 */
export const updateCalabrioUserState = async (_state: AppState, dispatch: any): Promise<void> => {
  try {
    const users: any = await getCalabrioUsers();
    dispatch({
      type: "loadCalabrioUsers",
      payload: users.data
    });
  } catch (error) {
    logger.error("Failed to update calabrio user state after bulk upload", { error }, false);
  }
  return Promise.resolve();
};

/**
 * Refreshes the calabrio WFM person state after a bulk update on users
 */
export const updateWFMPersonState = async (state: any, dispatch: any, rows: any[]): Promise<void> => {
  try {
    const BusinessUnitId = rows[0]?.BusinessUnitId;
    const businessUnit = state.calabrioContext.wfmOrg.find((bu: WfmBusinessUnit) => bu.Id === BusinessUnitId);
    delete businessUnit.Teams;
    await getCalabrioWfmOrg(BusinessUnitId, state, dispatch);
  } catch(error){
    logger.error("Failed to update calabrio wfm user state after bulk upload", { error }, false);
  }
  return Promise.resolve();
};

/** 
 * Refreshes the manager user state after a bulk update on users
 */
export const updateManagerUserState = async (dispatch: any): Promise<void> => {
  try {
    await listUMManagers(dispatch);
  } catch(err){
    logger.error("Failed to update manager state after bulk upload", err);
  }
  return Promise.resolve();
};

/**
 * Triggers a file upload from an input onChange. onload of the file, the first tab within an excel will be converted to a JSON.
 * @param e input object that holds the uploaded file
 * @param setUploadedForm function to update target with json conversion of the file
 */
export const readUploadFile = (e: any, setUploadedForm: any): void => {
  e.preventDefault();
  if (e.target.files) {
    const reader = new FileReader();
    reader.onload = e => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: UploadedRow[] = XLSX.utils.sheet_to_json(worksheet);

      logger.log("Spreadsheet json conversion", json);
      const rowNum = "__rowNum__";
      const headerRows = 1;
      if(typeof json ==="object"){
        setUploadedForm(json.map((r: UploadedRow) => {
          return {
            ...r,
            rowNumber: r[rowNum] + headerRows
          };
        }));
      }
    };
    reader.readAsArrayBuffer(e.target.files[0]);
  }
};

/**
 * Identifies successful records by eliminating the errors from the original list of rows.
 * @param totalRows array representing the original list of rows validated/processed
 * @param errors array representing the list of errors for the total rows
 */
export const identifySuccessfulRecords = (totalRows: any, errors: any) => {
  const successfulRows: any = [];
  totalRows.forEach((row: any) => {
    if(!errors.some((e: any) => e.rowNumber === row.rowNumber)){
      successfulRows.push(row);
    }
  });
  return successfulRows;
};

/**
 * Loops through the selected templates to identify if there are dependencies to other templates being processed, it returns
 * a dependency tree in the order it needs to be processed.
 * 
 * If only 1 template is being processed or there are no dependencies found, false is returned to indicate templates can be run asyncronously.
 * @param selectedTemplates array of the selected templates
 */
export const identifyProcessingDependencies = (selectedTemplates: any) => {
  if(selectedTemplates.length <= 1 ){
    return false;
  }
  // start with just templates that have 0 dependencies, those can safely go first
  const dependencyTree: any = selectedTemplates.filter((t: any) => !t.multiRunDependencies || t.multiRunDependencies.length === 0);

  const templatesWithDependencies = selectedTemplates.filter((t: any) => t.multiRunDependencies && t.multiRunDependencies.length > 0);

  for (let i = 0; i < templatesWithDependencies.length; i++) {

    templatesWithDependencies.forEach((t: any) => {
      let canAddToTree = true;
      t.multiRunDependencies.forEach((d: any) => {
        // if the required template is not already in the dependencyTree but is included in the selected templates, don't add the current template to the tree yet
        if (!dependencyTree.find((dt:any) => dt.name === d.name) && selectedTemplates.find((st: any) => st.name === d.name)) {
          canAddToTree = false;
        }
      });
      // if its okay to add it, and it isn't already in the dependencyTree, add it
      if (canAddToTree && !dependencyTree.find((dt: any) => dt.name === t.name)) {
        dependencyTree.push(t);
      }
    });
  }

  return dependencyTree;
};

/**
 * Templates may have an asyncronous concurrency max. You can pass any function into this method to drive how many are run at once
 * using a recursive function. It will return a consolidated array of promises representing each calls' results.
 * 
 * @param concurrencyMax how many calls should be run at once
 * @param functionToCall the function to call in batches
 * @param rows rows to process
 * @param progressCallback updates each time a record is processed, used to drive the progress bar
 */
export const handleConcurrentCalls = async (
  concurrencyMax: number,
  functionToCall: any,
  rows: any,
  progressCallback: any
) => {
  let currentIndex = 0;
  const totalCalls = rows.length;
  const processingResults: any = [];
  const delay = () => new Promise(resolve => setTimeout(resolve, 1500));

  const processBatch = async (): Promise<any> => {
    const endingIndex = currentIndex + concurrencyMax;
    const processingRows = rows.slice(currentIndex, endingIndex);
    await delay();

    const results = await Promise.allSettled(processingRows.map((row: any) => {
      return functionToCall(row, progressCallback);
    }));

    results.forEach((p: any) => processingResults.push(p));
    currentIndex = currentIndex + concurrencyMax;
    if(currentIndex < totalCalls){
      return processBatch();
    } else {
      Promise.resolve();
    }
  };

  await processBatch();
  logger.log("***handleConcurrentCalls - processingResults", processingResults.slice());
  return processingResults;
};

/**
 * Loops through the selected templates and returns the lowest validation or processing concurreny limit.
 * @param selectedTemplates selected templates to be processed
 * @param type validation/process limit indicator
 */
export const getLowestConcurrencyLimit = (selectedTemplates: any, type: string) => {
  let concurrencyLimit: any = null;
  if(type === "validation"){
    selectedTemplates.forEach(((t: any) => {
      if(t.validationConcurrencyLimit && (!concurrencyLimit || (concurrencyLimit && concurrencyLimit > t.validationConcurrencyLimit))){
        concurrencyLimit = t.validationConcurrencyLimit;
      }
    }));
  } else {
    selectedTemplates.forEach(((t: any) => {
      if(t.processingConcurrencyLimit && (!concurrencyLimit || (concurrencyLimit && concurrencyLimit > t.processingConcurrencyLimit))){
        concurrencyLimit = t.processingConcurrencyLimit;
      }
    }));
  }

  return concurrencyLimit;
};

/**
 * Uses the template tree and concurrency limits to intitiate the processing of the rows for each template selected.
 * @param rows rows to be processed
 * @param selectedTemplates selected templates to be processed
 * @param setProcessedRows React.useState hook to update the number of processed rows that drive the progress bar
 */
export const initiateCalls = async (
  rows: any,
  selectedTemplates: any,
  setProcessedRows: any,
  state: any,
  dispatch: any
) => {
  const templateTree = identifyProcessingDependencies(selectedTemplates);
  const concurrencyLimit: any = getLowestConcurrencyLimit(selectedTemplates, "processing");

  const finalErrors: any = [];
  let processingPromises;
  const processRow = async (row: any, progressCallback: any) => {

    if(templateTree){
      const rowPromise = await Promise.allSettled(templateTree.map(async (t: any) => {
        const delay = () => new Promise(resolve => setTimeout(resolve, 500));
        const maxAttempts = 5;

        /* Calls template processFuntions in the order identified by the dependency tree. It then uses a recursive function 
          to try & wait until the variable is set on the row from the dependent template to process the next template
        */
        const processTree = (attempt: number) => {
          if(t.multiRunDependencies && t.multiRunDependencies.length > 0){
            return Promise.all(t.multiRunDependencies.map(async (dependency: any) => {
              const variable = dependency.variable;
              if(attempt === maxAttempts && !row[variable]) {
                return Promise.reject(JSON.stringify({
                  rowNumber: row.rowNumber,
                  error: `${t.name} failed due to missing ${variable} from ${dependency.name}. If ${dependency.name} was successful it could have just taken too long and should be reprocessed.`
                }));
              } else if(!row[variable]){
                await delay();
                return processTree(attempt +1 );
              } else {
                return Promise.resolve();
              }
            }));
          } else {
            return Promise.resolve();
          }
        };

        await processTree(1);
        return await t.processFunction(row, t);
      }));
      progressCallback((previousCount: number) => (previousCount + 1));
      return rowPromise;
    } else {
      const rowPromise = await Promise.allSettled(selectedTemplates.map((t: any) => {
        return t.processFunction(row, t);
      }));
      progressCallback((previousCount: number) => (previousCount + 1));
      return rowPromise;
    }
  };

  if(concurrencyLimit){
    logger.warn("Concurrency Limit found", { concurrencyLimit }, false);
    processingPromises = await handleConcurrentCalls(concurrencyLimit, processRow, rows, setProcessedRows);
  } else {
    logger.warn("No Concurrency Limit found", {}, false);
    processingPromises = await Promise.allSettled(rows.map(async (row: any) => {
      return processRow(row, setProcessedRows);
    }));
  }

  processingPromises.forEach((rowPromise: any) => {
    let rowNumber: any;
    const rowErrors: any = [];

    rowPromise.value.map((processPromise: any) => {
      if(processPromise.status === "rejected"){
        const reason = JSON.parse(processPromise.reason);
        const error = reason.error || reason;
        if(!rowNumber){
          rowNumber = JSON.parse(processPromise.reason).rowNumber;
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

  const successfulRows = identifySuccessfulRecords(rows, finalErrors);
  const stateUpdateResults = await Promise.all(selectedTemplates.map((t: any) => {
    return Promise.allSettled(t.stateUpdateFunctions.map((f: any) => f(state, dispatch, successfulRows, selectedTemplates)));
  }));

  logger.log("state update results: ", stateUpdateResults);

  // looks for any WFM external logon activations that didn't go through and add them to the exported errors file
  stateUpdateResults.forEach((template: any) => {
    template.forEach((result: any) => {

      if (result.value) {
        const failedActivations = result.value.failedActivations || {};

        if (failedActivations.nNumbersWithoutTwilioWorkers?.length > 0){
          finalErrors.push({
            rowNumber: "multiple",
            errors: "No Twilio workers were found with these n-Numbers",
            wfmErrors: failedActivations.nNumbersWithoutTwilioWorkers.toString()
          });
        }
        if (failedActivations.workersFailedToActivate?.length > 0){
          finalErrors.push({
            rowNumber: "multiple",
            errors: `An error occurred and we were unable to activate these workers: ${failedActivations.message}`,
            wfmErrors: failedActivations.workersFailedToActivate.toString()
          });
        }
        if (failedActivations.workersFailedToReturnToOffline?.length > 0){
          finalErrors.push({
            rowNumber: "multiple",
            errors: "There was an error returning these workers to offline state",
            wfmErrors: failedActivations.workersFailedToReturnToOffline.toString()
          });
        }
      }
    });
  });

  if(finalErrors.length === 0){
    return Promise.resolve(rows);
  } else {
    return Promise.reject({
      success: successfulRows,
      errors: finalErrors
    });
  }
};

/**
 * Inspects rows that were already successfully processed and, if necessary, activates a WFM person's external logon
 * @param state application state
 * @param dispatch update state function
 * @param successfulRows rows to be processed
 * @param selectedTemplates selected templates to be processed
 */
export const handleWfmExternalLogon = async (state: AppState, dispatch: any, successfulRows: any, selectedTemplates: any) => {
  const { nNumber } = state.userContext;

  if(selectedTemplates.some((t: Template) => t.name === "CREATE_TRITON_USER")) {
    const wfmNNumbers: any[] = [];

    successfulRows.forEach((row: any) => {
      if (row.wfmActivateExternalLogon) {
        wfmNNumbers.push(row.attributes.n_number);
      }
    });

    // process in batches of max 25 to avoid gateway timeouts while waiting for calabrio
    const max = 25;
    const totalNNumbers = wfmNNumbers.length;
    const resultsArray: any[] = [];
    let currentIndex = 0;


    const processBatch = async (): Promise<any> => {
      const endingIndex = currentIndex + max;
      const processingNNumbers: any[] = wfmNNumbers.slice(currentIndex, endingIndex);

      try {
        const results = await wfmActivateExternalLogon(state.userContext.tokens.adminService, {
          workerNNumbers: processingNNumbers
        });

        logger.info("Successfully activated WFM external logon", {
          nNumber,
          workerNNumbers: processingNNumbers
        });

        resultsArray.push(results);
      } catch(error) {
        logger.info("Failed to activate WFM external logon", {
          nNumber,
          workerNNumbers: processingNNumbers,
          error
        });

        resultsArray.push({
          data: {
            failedActivations: {
              message: `${error.message || error} ${error.response.data && JSON.stringify(error.response.data)}`,
              workersFailedToActivate: processingNNumbers
            }
          }
        });
      }

      currentIndex = currentIndex + max;

      if(currentIndex < totalNNumbers){
        return processBatch();
      } else {
        Promise.resolve();
      }
    };
    await processBatch();

    const failedActivations = resultsArray[0]?.data?.failedActivations || {};
    const noWorkers: any = [];
    const failedToActivate: any = [];
    const failedToOffline: any = [];

    resultsArray.forEach((result: any) => {
      const {
        nNumbersWithoutTwilioWorkers,
        workersFailedToActivate,
        workersFailedToReturnToOffline
      } = result?.data?.failedActivations;

      if (nNumbersWithoutTwilioWorkers !== undefined || workersFailedToActivate !== undefined || workersFailedToReturnToOffline !== undefined) {
        const failed1 = result?.data?.failedActivations.nNumbersWithoutTwilioWorkers;
        const failed2 = result?.data?.failedActivations.workersFailedToActivate;
        const failed3 = result?.data?.failedActivations.workersFailedToReturnToOffline;

        failed1 && noWorkers.push(failed1);
        failed2 && failedToActivate.push(failed2);
        failed3 && failedToOffline.push(failed3);
      }
    });

    const wfmExternalLogonResults = {
      failedActivations: {
        message: failedActivations.message,
        nNumbersWithoutTwilioWorkers: noWorkers.flat(),
        workersFailedToActivate: failedToActivate.flat(),
        workersFailedToReturnToOffline: failedToOffline.flat()
      }
    };

    logger.log("*** External logon results: ", wfmExternalLogonResults);

    return wfmExternalLogonResults;
  } else {
    // another template was selected, skip
    return Promise.resolve("Selected template not CREATE_TRITON_USER, skipping handleWfmExternalLogon");
  }
};