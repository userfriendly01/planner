import React from "react";
import {
  ButtonWrapper,
  StyledExportButton,
  ModalWrapper,
  TextWrapper
} from "./BulkUpload.Styles";
import ProgressBar from "./ProgressBar";
import { ExcelExport } from "@progress/kendo-react-excel-export";

const ProcessingModal = (props: any) => {
  const {
    selectedTemplates,
    handleClose,
    consolidatedFieldsList,
    uploadedForm
  } = props;


  const [ validationErrors, setValidationErrors ] = React.useState([]);
  const [ showValidationErrors, setShowValidationErrors ] = React.useState(false);
  const [ showProgressBar, setShowProgressBar ] = React.useState(false);
  const _export = React.useRef(null);
  const totalRowCount = uploadedForm.length;
  const totalErrorCount = validationErrors.length;
  const totalSuccessCount = totalRowCount - totalErrorCount;

  let processedRows = 0;

  console.log("we're in the processing modal! validationErrors", validationErrors );
  console.log("we're in the processing modal! selectedTemplates", selectedTemplates );
  console.log("we're in the processing modal! uploadedForm", uploadedForm );
  console.log("we're in the processing modal! consolidatedFieldsList", consolidatedFieldsList );

  React.useEffect(() => {
    console.log("within Processing Modal [] useEffect");
    setShowProgressBar(true);
    performValidations();
  }, []);

  // React.useEffect(() => {
  //   console.log("within Processing Modal showProgressBar useEffect");
  //   performValidations();
  // }, [showProgressBar]);

  const performValidations = async () => {
    const finalErrors: any = [];
    const validationPromises = await Promise.allSettled(uploadedForm.map(async (row: any, index: number) => {
      const fieldPromises = await Promise.allSettled(consolidatedFieldsList.map((field: any) => {
        return field.validateFunction(row, index);
      }));
      processedRows = processedRows + 1;
      console.log("field promises", fieldPromises);
      return fieldPromises;
    }));
    console.log("Validation Promises: ", validationPromises);
    validationPromises.forEach((rowPromise: any, index: number) => {
      const rowErrors: any = [];
      console.log("rowPromise", rowPromise);
      rowPromise.value.map((fieldPromise: any) => {
        if(fieldPromise.status === "rejected"){
          console.log("Adding fieldPromise.reason to row Errors", fieldPromise.reason);
          rowErrors.push(fieldPromise.reason);
        }
      });
      if(rowErrors.length !== 0){
        console.log("pushing rowError onto Validation Error");
        finalErrors.push({
          row: index + 1,
          errors: rowErrors
        });
      }
    });
    console.log("finalErrors.length", finalErrors.length);
    if(finalErrors.length === 0){
      initiateCalls();
    } else {
      setShowProgressBar(false);
      setValidationErrors(finalErrors);
      setShowValidationErrors(true);
    }
  };

  const initiateCalls = () => {
    //identify successful records;
    setShowProgressBar(true);
    if(identifyProcessingDependencies()){
      //kick off api calls in order of dependency tree using template concurrency limit
    } else {
    //kick off api calls asyncronously using template concurrency limit
    }
  };

  const identifyProcessingDependencies = () => {
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

  const handleExport = () => {
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

  return (
    <ModalWrapper>
      { showValidationErrors &&
        <div>
          <TextWrapper styles ={{
            size: "26px"
          }}>
            {totalErrorCount} Validation Errors have been found for this template.
          </TextWrapper>
          <ButtonWrapper>
            <StyledExportButton onClick={handleClose}>
              Cancel
            </StyledExportButton>
            <StyledExportButton onClick={handleExport}><ExcelExport ref={_export}/>
              Export Validation Errors
            </StyledExportButton>
            <StyledExportButton styles={{ width: "200px" }} onClick={initiateCalls}>
              Process {totalSuccessCount} out of {totalRowCount} rows
            </StyledExportButton>
          </ButtonWrapper>
        </div>
      }
      { showProgressBar && <ProgressBar progress={processedRows}/> }
      <ProgressBar progress={processedRows}/>
      Modal - changes made!
    </ModalWrapper>
  );
};

export default ProcessingModal;