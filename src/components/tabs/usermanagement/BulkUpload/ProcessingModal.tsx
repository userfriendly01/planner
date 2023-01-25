import React from "react";
import {
  ButtonWrapper,
  StyledExportButton
} from "./BulkUpload.Styles";
import ProgressBar from "./ProgressBar";
import { ExcelExport } from "@progress/kendo-react-excel-export";

const ProcessingModal = (props: any) => {
  const {
    selectedTemplates,
    handleClose,
    validationErrors,
    uploadedForm
  } = props;

  const _export = React.useRef(null);
  const totalRowCount = uploadedForm.length;
  const totalErrorCount = validationErrors.length;
  const totalSuccessCount = totalRowCount - totalErrorCount;

  const [ showProgressBar, setShowProgressBar ] = React.useState(false);

  React.useEffect(() => {
    if(validationErrors.length === 0){
      initiateCalls();
    }
  }, []);

  const initiateCalls = () => {
    setShowProgressBar(true);
    if(identifyProcessingDependencies()){
      //kick off api calls in order of dependency tree using template concurrency limit
    } else {
    //kick off api calls asyncronously using template concurrency limit
    }
  };

  const identifyProcessingDependencies = () => {
    //if theres only one template, just return it
    //if no dependencies, return it
    //if dependencies that arent in the selected template, return it
    //if there's more than one, return to dependency tree 
    return false;
  };

  const handleExport = () => {
    const rows: any = validationErrors;
    console.log("rows", rows);

    if (_export.current !== null) {
      _export.current.save(rows);
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default ProcessingModal;