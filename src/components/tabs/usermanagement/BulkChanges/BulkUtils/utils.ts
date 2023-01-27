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

export const initiateCalls = async (
  uploadedForm: any,
  validationErrors: any,
  selectedTemplates: any
) => {
  const successfulRows = identifySuccessfulRecords(uploadedForm, validationErrors);
  const templateTree = identifyProcessingDependencies(selectedTemplates);
  console.log("Successful rows", successfulRows);

  const processRow = async (row: any, rowNumber: number, progressCallback: any) => {

    let finalPromises: any = [];

    if(templateTree){
      console.log("templateTree", templateTree);
      return await Promise.allSettled(templateTree.map(async (t: any) => {
        console.log("processing template", t.name);
        const data = {};

        if(t.multiRunDependencies && t.multiRunDependencies.length > 0){
          t.multiRunDependencies.forEach((dependency: any) => {
            console.log(`Looking for ${dependency.name}`, templateTree);
            const foundDependency = finalPromises.find(((t: any) => t.name === dependency.name));
            const variable = dependency.variable;
            console.log("looking in final promises for ", foundDependency, variable);
          });
        }

        const promiseResponse = await t.processFunction(row, rowNumber, data);
        console.log("PROCESS PROMISE COMPLETE: ", promiseResponse);
        finalPromises.push({
          name: t.name,
          data: promiseResponse.value
        });
      }));
    } else {
      finalPromises = await Promise.allSettled(selectedTemplates.map((t: any) => {
        return t.processFunction();
      }));
    }
  };

  console.log("no dependencies needed: final promises", finalPromises.slice());

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

  if (_export.current !== null) {
    _export.current.save(rows, columns);
  }
};

export const checkConflictingUsers = async (user: any, users: CalabrioUser[], roles: any[], teams: any[]): Promise<void> => {
  try {
    const {
      acdId
    } = user;

    const firstName = toLowerCaseString(user.firstName);
    const lastName = toLowerCaseString(user.lastName);
    const email = toLowerCaseString(user.email);
    const adLogin = toLowerCaseString(user.adLogin);

    await Promise.all(users.map(async u => {
      if(acdId && u.acdId === acdId){
        return;
      }

      const dupUserAdLogin = toLowerCaseString(u.adLogin);
      const dupUserEmail = toLowerCaseString(u.email);
      const dupUserFirstName = toLowerCaseString(u.firstName);
      const dupUserLastName = toLowerCaseString(u.lastName);

      if (dupUserAdLogin === adLogin || dupUserEmail === email) {
        const res: CalabrioUser = await getCalabrioUser(u.id);
        const dupUser = res.data;
        console.warn("Conflicting User Found with Duplicate Email or Windows Login: ", dupUser);

        dupUser.deactivated = Date.now();
        dupUser.adLogin = `xx-${dupUser.id}-${dupUser.adLogin}`;
        dupUser.email = `xx-${dupUser.id}-${dupUser.email}`;
        dupUser.acdId = `xx-${dupUser.acdId}`;

        if(dupUser.roles.length === 0){
          dupUser.roles = roles.filter(role => role.name.toLowerCase().includes("agent-sync"));
        }
        if(!dupUser.team){
          console.warn("do we get in here?", teams.find(team => team.name.toLowerCase().includes("default")));
          dupUser.team = teams.find(team => team.name.toLowerCase().includes("default"))?.groupId;
        }

        await updateCalabrioUser(dupUser.id, dupUser);
        return;
      }

      if (!dupUserEmail && acdId && firstName === dupUserFirstName && lastName === dupUserLastName) {
        const res: CalabrioUser = await getCalabrioUser(u.id);
        const dupUser = res.data;
        console.warn("Conflicting User Found with First and Last Name: ", dupUser);

        dupUser.deactivated = Date.now();
        dupUser.adLogin = `SHELLUSER-${dupUser.id}`;
        dupUser.email = `SHELLUSER-${dupUser.id}@libertymutual.com`;
        dupUser.acdId = `SH-${dupUser.acdId}`;

        if(dupUser.roles.length === 0){
          dupUser.roles = roles.filter(role => role.name.toLowerCase().includes("agent-sync"));
        }
        if(!dupUser.team){
          dupUser.team = teams.find(team => team.name.toLowerCase().includes("default"))?.groupId;
        }
        await updateCalabrioUser(dupUser.id, dupUser);
        return;
      }
    }));
  } catch(err) {
    console.error("Error thrown trying to fetch and validate Conflicting Users", err);
  }
  return;
};