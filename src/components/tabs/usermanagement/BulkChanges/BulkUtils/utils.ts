import * as XLSX from "xlsx";

export const toLowerCaseString = (variable: any) => {
  return typeof variable === "string" ? variable.toLowerCase() : variable;
};

export const readUploadFile = (e: any, setUploadedForm: any): void => {
  console.log("UPLOAD FILED", e);
  e.preventDefault();
  if (e.target.files) {
    const reader = new FileReader();
    reader.onload = e => {
      const data = e.target.result;
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

export const consolidateTemplates = (selectedTemplates: any, setConsolidatedTemplates: any): void => {
  const beginningArray: any = [];
  selectedTemplates.forEach((t: any) => beginningArray.push(...t.fields));
  const consolidatedFieldsList: any = [];
  beginningArray.forEach((bt: any) => {
    const duplicateField = consolidatedFieldsList.some((field: any) => field.field === bt.field);
    if(!duplicateField){
      consolidatedFieldsList.push(bt);
    }
  });
  console.log("consolidatedFieldsList", consolidatedFieldsList);
  setConsolidatedTemplates(consolidatedFieldsList);
};

export const identifySuccessfulRecords = (uploadedForm: any, validationErrors: any) => {
  const successfulRows: any = [];
  uploadedForm.forEach((row: any, index: number) => {
    const rowEquivalent = index + 1;
    if(!validationErrors.some((e: any) => e.row === rowEquivalent)){
      successfulRows.push(row);
    }
  });
  console.log("successfulRows", successfulRows);
  return successfulRows;
};

const identifyProcessingDependencies = (selectedTemplates: any) => {
  const dependencyTree = selectedTemplates.slice();

  //if theres only one template, just return it
  if(selectedTemplates.length === 1){
    console.log("identifyProcessingDependencies - selectedTemplates.length === 1");
    return false;
  }

  selectedTemplates.forEach((t: any, index: number) => {
    if(t.multiRunDependencies){
      console.log("identifyProcessingDependencies - t.multiRunDependencies", t.multiRunDependencies);
      t.multiRunDependencies.forEach((d: any) => {
        const requiredTemplateIndex = dependencyTree.findIndex((t:any) => t.name === d.name);
        console.log("identifyProcessingDependencies - requiredTemplateIndex", requiredTemplateIndex);
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

export const handleConcurrentCalls = async (
  concurrencyMax: number,
  apiCall: any,
  successfulRows: any,
  progressCallback: any
) => {
  const totalCalls = successfulRows.length;
  let currentIndex = 0;
  const processingResults: any = [];
  const delay = () => {
    return new Promise(resolve => setTimeout(resolve, 1500));
  };

  const processApiCall = async (): Promise<any> => {
    const endingIndex = currentIndex + concurrencyMax;
    const processingRows = successfulRows.slice(currentIndex, endingIndex);
    console.log("***Processing: ", processingRows);
    await delay();

    const results = await Promise.allSettled(processingRows.map((row: any, index: number) => {
      const originalRowIndex = currentIndex + index;
      const originalRowNumber = originalRowIndex + 2; //When original spreadsheet has header this is 2 vs 1
      return apiCall(row, originalRowNumber, progressCallback);
    }));
    console.log("***results should be settled promises", results.slice());
    results.forEach((p: any) => processingResults.push(p));
    currentIndex = currentIndex + concurrencyMax;
    console.log("*** sectioned Processing Results", processingResults.slice());
    if(currentIndex < totalCalls){
      console.log("***current index: ", currentIndex);
      return processApiCall();
    } else {
      Promise.resolve();
    }
  };

  await processApiCall();
  console.log("***Final Processing Results", processingResults.slice());
  return processingResults;
};

export const getLowestConcurrencyLimit = (selectedTemplates: any) => {
  let concurrencyLimit: any = null;
  selectedTemplates.forEach(((t: any) => {
    //if false or if true & less than this one
    if(t.validationConcurrencyLimit && (!concurrencyLimit || (concurrencyLimit && concurrencyLimit > t.validationConcurrencyLimit))){
      concurrencyLimit = t.validationConcurrencyLimit;
    }
  }));
  return concurrencyLimit;
};

export const initiateCalls = async (
  successfulRows: any,
  validationErrors: any,
  selectedTemplates: any,
  setProcessedRows: any
) => {
  const templateTree = identifyProcessingDependencies(selectedTemplates);
  const concurrencyLimit: any = getLowestConcurrencyLimit(selectedTemplates);

  const finalErrors: any = [];
  let processingPromises;

  console.log("Successful rows", successfulRows);

  const processRow = async (row: any, rowNumber: number, progressCallback: any) => {

    if(templateTree){
      console.log("templateTree", templateTree);
      const rowPromise = await Promise.allSettled(templateTree.map(async (t: any) => {
        console.log("processing template", t.name);

        if(t.multiRunDependencies && t.multiRunDependencies.length > 0){
          t.multiRunDependencies.forEach((dependency: any) => {
            console.log(`Looking for ${dependency.variable} in`, row);
            const variable = dependency.variable;
            if(!row[variable]){
              Promise.reject(`${t.name} failed due to missing ${variable} from ${dependency.name}`);
            }
          });
        }

        const promiseResponse = await t.processFunction(row, rowNumber);
        console.log("PROCESS PROMISE COMPLETE: ", promiseResponse);
      }));
      progressCallback((previousCount: number) => (previousCount + 1));
      return rowPromise;
    } else {
      const rowPromise = await Promise.allSettled(selectedTemplates.map((t: any) => {
        return t.processFunction();
      }));
      progressCallback((previousCount: number) => (previousCount + 1));
      return rowPromise;
    }
  };

  if(concurrencyLimit){
    processingPromises = await handleConcurrentCalls(concurrencyLimit, processRow, successfulRows, setProcessedRows);
  } else {
    processingPromises = await Promise.allSettled(successfulRows.map(async (row: any, index: number) => {
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
  console.log("finalErrors.length", finalErrors.length);
  if(finalErrors.length === 0){
    return Promise.resolve(successfulRows);
  } else {
    return Promise.reject({
      success: identifySuccessfulRecords(successfulRows, finalErrors),
      errors: finalErrors
    });
  }
};

export const performValidations = async (
  uploadedForm: any,
  selectedTemplates: any,
  consolidatedFieldsList: any,
  setProcessedRows: any
): Promise<any> => {
  const finalErrors: any = [];
  let validationPromises;
  const concurrencyLimit: any = getLowestConcurrencyLimit(selectedTemplates);

  const processValidationsOnRows = async (row: any, rowIndex: number, progressCallback: any): Promise<any> => {
    const fieldPromises = await Promise.allSettled(consolidatedFieldsList.map((field: any) => {
      return field.validateFunction(row, rowIndex);
    }));
    progressCallback((previousCount: number) => (previousCount + 1));
    return fieldPromises;
  };

  if(concurrencyLimit){
    validationPromises = await handleConcurrentCalls(concurrencyLimit, processValidationsOnRows, uploadedForm, setProcessedRows);
  } else {
    validationPromises = await Promise.allSettled(uploadedForm.map(async (row: any, index: number) => {
      const rowNumber = index + 1;
      return processValidationsOnRows(row, rowNumber, setProcessedRows);
    }));
  }

  console.log("Validation Promises: ", validationPromises);
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
  console.log("finalErrors.length", finalErrors.length);
  if(finalErrors.length === 0){
    return Promise.resolve();
  } else {
    return Promise.reject(finalErrors);
  }
};

export const handleExportErrors = (validationErrors: any, _export: any) => {
  const rows: any = [];
  const columns: any = [
    {
      title: "Row",
      field: "row",
      width: "50px"
    },
    {
      title: "Errors",
      field: "errors",
      width: "400px"
    }
  ];

  validationErrors.forEach((error: any) => {
    rows.push({
      row: error.row,
      errors: error.errors.toString()
    });
  });

  console.log("rows", rows);
  console.log("columns", columns);

  if (_error_export.current !== null) {
    _error_export.current.save(rows, columns);
  }
};

export const handleExportSuccessfulRecords = (successfulRows: any, _export: any) => {
  const rows: any = successfulRows;
  const columns: any = [
    {
      title: "Row",
      field: "row",
      width: "50px"
    },
    {
      title: "Errors",
      field: "errors",
      width: "400px"
    }
  ];

  if(successfulRows.length > 0){
    Object.keys(successfulRows[0]).forEach((key: string) => {
      columns.push({
        title: key,
        field: key,
        width: "50px"
      });
    });
  }


  console.log("rows", rows);
  console.log("columns", columns);

  if (_success_export.current !== null) {
    _success_export.current.save(rows, columns);
  }
};

export const checkConflictingUsers = async (user: any, users: any[]): Promise<any> => {
  if(user){
    try {
      const acdId = user.workerSid ? toLowerCaseString(user.workerSid) : null;
      const email = toLowerCaseString(user.email);
      const adLogin = toLowerCaseString(user.adLogin);

      return Promise.allSettled(users.map(async u => {
        const dupUserAcdId = toLowerCaseString(u.acdId);
        const dupUserAdLogin = toLowerCaseString(u.adLogin);
        const dupUserEmail = toLowerCaseString(u.email);

        if (acdId && dupUserAcdId === acdId) {
          return Promise.reject("Calabrio Record already exists with this users nNumber in the AdLogin field.");
        }

        if (dupUserAdLogin === adLogin) {
          return Promise.reject("Calabrio Record already exists with this users nNumber in the AdLogin field.");
        }

        if (dupUserEmail === email) {
          return Promise.reject("Calabrio Record already exists with this users email.");
        }
      }));
    } catch(err) {
      console.error("Error thrown trying to fetch and validate Conflicting Users", err);
      return Promise.reject(err);
    }
  }
  return Promise.reject("No user passed to calabrio processing");
};
