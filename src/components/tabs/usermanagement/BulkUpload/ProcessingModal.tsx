import React from "react";
import {
  ButtonWrapper,
  StyledExportButton,
  ModalWrapper
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
  const [ showProgressBar, setShowProgressBar ] = React.useState(false);
  const _export = React.useRef(null);
  const totalRowCount = uploadedForm.length;
  const totalErrorCount = validationErrors.length;
  const totalSuccessCount = totalRowCount - totalErrorCount;

  console.log("we're in the processing modal! validationErrors", validationErrors );
  console.log("we're in the processing modal! selectedTemplates", selectedTemplates );
  console.log("we're in the processing modal! uploadedForm", uploadedForm );
  console.log("we're in the processing modal! consolidatedFieldsList", consolidatedFieldsList );

  React.useEffect(() => {
    performValidations();
    // if(validationErrors.length === 0){
    //   initiateCalls();
    // }
  }, []);

  const performValidations = async () => {

    const validationPromises = await Promise.allSettled(uploadedForm.map((row: any, index: number) => {
      return consolidatedFieldsList.map((field: any) => {
        return field.validateFunction(row, index);
      });
    }));
    console.log("Validation Promises: ", validationPromises);
    const validationErrors: any = [];
    validationPromises.forEach((promise: any) => {
      console.log("promise/row: ", promise);
      console.log("promise.value: ", promise.value);
      promise.value.forEach(async (innerPromise: any) => {
        console.log("innerPromise: ", innerPromise);
        await innerPromise;
        console.log("innerPromise after await is added: ", innerPromise);
        if(error){
          console.log("innerPromise.status: ", innerPromise.status);
          console.log("innerPromise.reason: ", innerPromise.reason);
          console.log("innerPromise.value: ", innerPromise.value);
        }
        validationErrors.push(error);
      });
    });
    if(validationErrors.length === 0){
      initiateCalls();
    } else {
      setValidationErrors(validationErrors);
    }
  };

  const initiateCalls = () => {
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
    const rows: any = validationErrors;
    console.log("rows", rows);

    if (_export.current !== null) {
      _export.current.save(rows);
    }
  };

  return (
    <ModalWrapper>
      { validationErrors.length > 0 &&
        <div>
          {totalErrorCount} Validation Errors have been found for this template.
          <ButtonWrapper>
            <StyledExportButton onClick={handleClose}>
              Cancel
            </StyledExportButton>
            <StyledExportButton onClick={handleExport}><ExcelExport ref={_export}/>
              Export Validation Errors
            </StyledExportButton>
            <StyledExportButton onClick={initiateCalls}>
              Process {totalSuccessCount} out of {totalRowCount} rows
            </StyledExportButton>
          </ButtonWrapper>
        </div>
      }
      { showProgressBar && <ProgressBar /> }
      Modal!
    </ModalWrapper>
  );
};

export default ProcessingModal;