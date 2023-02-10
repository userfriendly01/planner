import * as XLSX from "xlsx";

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
      const json = XLSX.utils.sheet_to_json(worksheet);
      console.log(json);
      setUploadedForm(json);
    };
    reader.readAsArrayBuffer(e.target.files[0]);
  }
};

/**
 * Identifies successful records by eliminating the errors from the original list of rows.
 * @param totalRows array representing the original list of rows validated/processed
 * @param validationErrors array representing the list of errors for the total rows
 */
export const identifySuccessfulRecords = (totalRows: any, validationErrors: any) => {
  const successfulRows: any = [];
  totalRows.forEach((row: any, index: number) => {
    const rowEquivalent = index + 2;  //When original spreadsheet has header this is 2 vs 1
    if(!validationErrors.some((e: any) => e.row === rowEquivalent)){
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
  const dependencyTree = selectedTemplates.slice();

  if(selectedTemplates.length <= 1 ){
    return false;
  }

  selectedTemplates.forEach((t: any, index: number) => {
    if(t.multiRunDependencies){
      t.multiRunDependencies.forEach((d: any) => {
        const requiredTemplateIndex = dependencyTree.findIndex((t:any) => t.name === d.name);
        //if dependencies arent in the selected templates list, return it. Form validation accounts for this
        if(requiredTemplateIndex === -1){
          return false;
        } else {
          //If the dependency is lower in the array, swap the index's so they are processed in the right order
          if(requiredTemplateIndex > index){
            const dependentObject = dependencyTree[index];
            const requiredObject = dependencyTree[requiredTemplateIndex];
            dependencyTree[index] = requiredObject;
            dependencyTree[requiredTemplateIndex] = dependentObject;
          }
          console.log("identifyProcessingDependencies - dependencyTree", dependencyTree.slice());
        }
      });
    }
  });
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

    const results = await Promise.allSettled(processingRows.map((row: any, index: number) => {
      const originalRowIndex = currentIndex + index;
      const originalRowNumber = originalRowIndex + 2; //When original spreadsheet has header this is 2 vs 1
      return functionToCall(row, originalRowNumber, progressCallback);
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
  console.log("***handleConcurrentCalls - processingResults", processingResults.slice());
  return processingResults;
};

/**
 * Loops through the selected templates and returns the lowest validation or processing concurreny limit.
 * @param selectedTemplates selected templates to be processed
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
  setProcessedRows: any
) => {
  const templateTree = identifyProcessingDependencies(selectedTemplates);
  const concurrencyLimit: any = getLowestConcurrencyLimit(selectedTemplates, "processing");

  const finalErrors: any = [];
  let processingPromises;

  const processRow = async (row: any, rowNumber: number, progressCallback: any) => {

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
                return Promise.reject(`${t.name} failed due to missing ${variable} from ${dependency.name}. If ${dependency.name} was successful it could have just taken too long and should be reprocessed.`);
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
        return await t.processFunction(row, rowNumber, t);
      }));
      progressCallback((previousCount: number) => (previousCount + 1));
      return rowPromise;
    } else {
      const rowPromise = await Promise.allSettled(selectedTemplates.map((t: any) => {
        return t.processFunction(row, rowNumber, t);
      }));
      progressCallback((previousCount: number) => (previousCount + 1));
      return rowPromise;
    }
  };

  if(concurrencyLimit){
    console.log("Concurrency Limit found", concurrencyLimit);
    processingPromises = await handleConcurrentCalls(concurrencyLimit, processRow, rows, setProcessedRows);
  } else {
    console.log("No Concurrency Limit found");
    processingPromises = await Promise.allSettled(rows.map(async (row: any, index: number) => {
      const rowNumber = index + 1;
      return processRow(row, rowNumber, setProcessedRows);
    }));
  }

  processingPromises.forEach((rowPromise: any, index: number) => {
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
    return Promise.resolve(rows);
  } else {
    return Promise.reject({
      success: identifySuccessfulRecords(rows, finalErrors),
      errors: finalErrors
    });
  }
};