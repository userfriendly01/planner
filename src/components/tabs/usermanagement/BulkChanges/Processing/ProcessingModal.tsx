import React from "react";
import {
  ButtonWrapper,
  StyledExportButton,
  ModalWrapper,
  TextWrapper,
  ValidationErrorWrapper
} from "../BulkChanges.Styles";
import {
  performValidations,
  initiateCalls,
  handleExportErrors
} from "../BulkUtils/utils";
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


  const [ processedRows, setProcessedRows ] = React.useState(0);

  console.log("we're in the processing modal! validationErrors", validationErrors );
  console.log("we're in the processing modal! selectedTemplates", selectedTemplates );
  console.log("we're in the processing modal! uploadedForm", uploadedForm );
  console.log("we're in the processing modal! consolidatedFieldsList", consolidatedFieldsList );
  console.log("we're in the processing modal! showProgressBar", showProgressBar );
  console.log("we're in the processing modal! processedRows", processedRows );


  console.log(processedRows);
  React.useEffect(() => {
    console.log("within Processing Modal [] useEffect");
    setShowProgressBar(true);
    setTimeout(async () => {
      try {
        await performValidations(uploadedForm, consolidatedFieldsList, setProcessedRows);
        handleStartProcessing();
        initiateCalls(uploadedForm, validationErrors, selectedTemplates);
      } catch (err) {
        console.log("FINAL ERRORS LOG", err);
        setShowProgressBar(false);
        setValidationErrors(err);
        setShowValidationErrors(true);
      }
    }, 1000);
  }, []);

  const handleStartProcessing = () => {
    setShowValidationErrors(false);
    setShowProgressBar(true);
  };

  return (
    <ModalWrapper>
      { showValidationErrors &&
        <ValidationErrorWrapper>
          <TextWrapper styles={{
            size: "26px"
          }}>
            {totalErrorCount} Validation Errors have been found for this template.
          </TextWrapper>
          <ButtonWrapper>
            <StyledExportButton onClick={handleClose}>
              Cancel
            </StyledExportButton>
            <StyledExportButton onClick={() => handleExportErrors(validationErrors, _export)}><ExcelExport ref={_export}/>
              Export Validation Errors
            </StyledExportButton>
            <StyledExportButton styles={{ width: "250px" }} onClick={() => {
              handleStartProcessing();
              initiateCalls(uploadedForm, validationErrors, selectedTemplates);
            }}>
              Process {totalSuccessCount} out of {totalRowCount} rows
            </StyledExportButton>
          </ButtonWrapper>
        </ValidationErrorWrapper>
      }
      { showProgressBar && <ProgressBar completedRows={processedRows} totalRowCount={totalRowCount}/> }
    </ModalWrapper>
  );
};

export default ProcessingModal;