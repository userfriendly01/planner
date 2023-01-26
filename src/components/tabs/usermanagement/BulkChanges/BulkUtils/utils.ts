import * as XLSX from "xlsx";

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

const identifySuccessfulRecords = (uploadedForm: any, validationErrors: any) => {
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

  const processApiCall = async (): Promise<any> => {
    const endingIndex = currentIndex + concurrencyMax;
    const processingRows = successfulRows.slice(currentIndex, endingIndex);
    console.log("***Processing: ", processingRows);

    const results = await Promise.allSettled(processingRows.map((row: any, index: number) => {
      const originalRowIndex = currentIndex + index;
      const originalRowNumber = originalRowIndex+ 1;
      return apiCall(row, originalRowNumber, progressCallback);
    }));
    console.log("***results should be settled promises", results.slice());
    results.forEach((p: any) => processingResults.push(p));
    currentIndex = currentIndex + concurrencyMax;
    console.log("*** sectioned Processing Results", processingResults.slice());
    if(currentIndex < totalCalls){
      console.log("***current index: ", currentIndex);
      return setTimeout(processApiCall, 1000);
    } else {
      Promise.resolve();
    }
  };

  await processApiCall();
  console.log("***Final Processing Results", processingResults.slice());
  return processingResults;
};

export const initiateCalls = async (
  uploadedForm: any,
  validationErrors: any,
  selectedTemplates: any
) => {
  //Add in concurrency limit
  const totalCalls = uploadedForm.length;
  const concurrencyMax = 10;
  const currentIndex = 0;
  const successfulRows = identifySuccessfulRecords(uploadedForm, validationErrors);
  const dependencies = identifyProcessingDependencies(selectedTemplates);
  if(dependencies){
    console.log("dependencies", dependencies);
    // dependencies.map(async (d: any) => {
    //   d.processFunction();
    // });
    //kick off api calls in order of dependency tree using template concurrency limit
  } else {
    console.log("no dependencies needed");
  //kick off api calls asyncronously using template concurrency limit
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
  let concurrencyLimit: any = null;
  selectedTemplates.forEach(((t: any) => {
    //if false or if true & less than this one
    if(t.validationConcurrencyLimit && (!concurrencyLimit || (concurrencyLimit && concurrencyLimit > t.validationConcurrencyLimit))){
      concurrencyLimit = t.validationConcurrencyLimit;
    }
  }));

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
        row: index + 1,
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

  if (_export.current !== null) {
    _export.current.save(rows, columns);
  }
};
