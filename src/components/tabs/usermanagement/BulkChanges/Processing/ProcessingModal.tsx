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
  handleExportErrors,
  handleExportSuccessfulRecords,
  identifySuccessfulRecords
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

  const [ errors, setErrors ] = React.useState([]);
  const [ showValidationErrors, setShowValidationErrors ] = React.useState(false);
  const [ showSummary, setShowSummary ] = React.useState(false);
  const [ showProgressBar, setShowProgressBar ] = React.useState(false);
  const _error_export = React.useRef(null);
  const _success_export = React.useRef(null);

  const [ totalRowCount, setTotalRowCount ] = React.useState(uploadedForm.length);
  const totalErrorCount = errors.length;
  const totalSuccessCount = totalRowCount - totalErrorCount;


  const [ processedRows, setProcessedRows ] = React.useState(0);

  console.log("we're in the processing modal! errors", errors );
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
        await performValidations(uploadedForm, selectedTemplates, consolidatedFieldsList, setProcessedRows);
        handleStartProcessing();
      } catch (err) {
        console.log("FINAL ERRORS LOG", err);
        setShowProgressBar(false);
        setErrors(err);
        setShowValidationErrors(true);
      }
    }, 1000);
  }, []);

  const handleStartProcessing = async () => {
    const byPassedValidationErrors = errors.slice();
    setErrors([]);
    setShowValidationErrors(false);
    setShowProgressBar(true);
    setProcessedRows(0);
    const successfulRows = identifySuccessfulRecords(uploadedForm, byPassedValidationErrors);
    try {
      setTotalRowCount(successfulRows);
      const results = await initiateCalls(successfulRows, errors, selectedTemplates, setProcessedRows);
      setShowSummary(true);
      console.log("PROCESSING IS DONE!!", results);
    } catch(err){
      setErrors(err);
      setShowSummary(true);
      console.log("PROCESSING IS DONE BUT FAILED!!", err);
    }
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
            <StyledExportButton onClick={() => handleExportErrors(errors, _error_export)}><ExcelExport ref={_error_export}/>
              Export Validation Errors
            </StyledExportButton>
            <StyledExportButton onClick={handleStartProcessing}>
              Process {totalSuccessCount} out of {totalRowCount} rows
            </StyledExportButton>
          </ButtonWrapper>
        </ValidationErrorWrapper>
      }
      { showProgressBar && <ProgressBar completedRows={processedRows} totalRowCount={totalRowCount}/> }
      { showSummary &&
        <ValidationErrorWrapper>
          <TextWrapper styles={{
            size: "26px"
          }}>
            {totalErrorCount} Validation Errors have been found for this template.
          </TextWrapper>
          <ButtonWrapper>
            { errors.length > 0 &&
              <StyledExportButton onClick={() => handleExportErrors(errors, _error_export)}><ExcelExport ref={_error_export}/>
                Export Processing Errors
              </StyledExportButton>
            }
            <StyledExportButton onClick={() => handleExportSuccessfulRecords(errors, _success_export)}><ExcelExport ref={_success_export}/>
              Export Successful Rows
            </StyledExportButton>
            <StyledExportButton  onClick={handleClose}>
              Close {totalSuccessCount} out of {totalRowCount} rows
            </StyledExportButton>
          </ButtonWrapper>
        </ValidationErrorWrapper>
      }
    </ModalWrapper>
  );
};

export default ProcessingModal;