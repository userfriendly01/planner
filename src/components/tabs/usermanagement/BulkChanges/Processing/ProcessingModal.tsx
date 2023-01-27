import React from "react";
import {
  ButtonWrapper,
  StyledExportButton,
  ModalWrapper,
  TextWrapper,
  ValidationErrorWrapper
} from "../BulkChanges.Styles";
import ExportSuccessButton from "../ExportButtons/ExportSuccessButton";
import ExportErrorsButton from "../ExportButtons/ExportErrorsButton";
import {
  performValidations,
  initiateCalls,
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
  const [ successfulRows, setSuccessfulRows ] = React.useRef([]);

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
    setSuccessfulRows(successfulRows);
    try {
      setTotalRowCount(successfulRows.length);
      const results = await initiateCalls(successfulRows, selectedTemplates, setProcessedRows);
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
            <ExportErrorsButton errors={errors}><ExcelExport/>
              Export Validation Errors
            </ExportErrorsButton>
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
              <ExportErrorsButton errors={errors}><ExcelExport/>
                Export Processing Errors
              </ExportErrorsButton>
            }
            <ExportSuccessButton successfulRows={successfulRows}><ExcelExport/>
              Export Successful Rows
            </ExportSuccessButton>
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