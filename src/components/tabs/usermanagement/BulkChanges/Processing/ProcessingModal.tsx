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

  enum STATES {
    VALIDATING = "validating",
    VALIDATED = "validated",
    PROCESSING = "processing",
    PROCESSED = "processed"
  }

  const [ results, setResults ] = React.useState({
    validationErrors: [],
    processingErrors: [],
    successfullyValidatedRows: [],
    successfullyProcessedRows: []
  });

  const [ status, setStatus ] = React.useState(null);
  const [ processedRows, setProcessedRows ] = React.useState(null);

  console.log("we're in the processing modal! results", results );
  console.log("we're in the processing modal! status", status );
  console.log("we're in the processing modal! processedRows", processedRows );
  console.log("we're in the processing modal! uploadedForm", uploadedForm );

  React.useEffect(() => {
    setStatus(STATES.VALIDATING);
    setTimeout(async () => {
      try {
        await performValidations(uploadedForm, selectedTemplates, consolidatedFieldsList, setProcessedRows);
        setResults({
          ...results,
          successfullyValidatedRows: uploadedForm
        });
        handleStartProcessing();
      } catch (err) {
        console.log("Validation Errors Log", err);
        const successfullyValidatedRows = identifySuccessfulRecords(uploadedForm, err.slice());
        setResults({
          ...results,
          validationErrors: err,
          successfullyValidatedRows
        });
        setStatus(STATES.VALIDATED);
      }
    }, 1000);
  }, []);

  const handleStartProcessing = async () => {
    setProcessedRows(0);
    const rowsToProcess = results.successfullyValidatedRows;
    try {
      const successfullyProcessedRows = await initiateCalls(rowsToProcess, selectedTemplates, setProcessedRows);
      setResults({
        ...results,
        successfullyProcessedRows
      });
      setStatus(STATES.PROCESSED);
      console.log("PROCESSING IS DONE!!", results);
    } catch(err){
      console.log("PROCESSING IS DONE BUT FAILED!!", err);
      setResults({
        ...results,
        processingErrors: err.errors,
        successfullyProcessedRows: err.success
      });
      setStatus(STATES.PROCESSED);
    }
  };

  return (
    <ModalWrapper>
      { status === STATES.VALIDATED &&
        <ValidationErrorWrapper>
          <TextWrapper styles={{
            size: "26px"
          }}>
            {results.validationErrors.length} Validation Errors have been found for this template.
          </TextWrapper>
          <ButtonWrapper>
            <StyledExportButton onClick={handleClose}>
              Cancel
            </StyledExportButton>
            { results.validationErrors.length > 0 &&
              <ExportErrorsButton errors={results.validationErrors}><ExcelExport/>
                Export Validation Errors
              </ExportErrorsButton>
            }
            <StyledExportButton onClick={handleStartProcessing}>
              Process {results.successfullyValidatedRows.length} out of {uploadedForm.length} rows
            </StyledExportButton>
          </ButtonWrapper>
        </ValidationErrorWrapper>
      }
      { status === STATES.VALIDATING && <ProgressBar completedRows={processedRows} totalRowCount={uploadedForm.length}/> }
      { status === STATES.PROCESSING && <ProgressBar completedRows={processedRows} totalRowCount={results.successfullyValidatedRows.length}/> }
      { status === STATES.PROCESSED &&
        <ValidationErrorWrapper>
          { results.processingErrors.length > 0 &&
            <TextWrapper styles={{ size: "26px" }}>
              Processing Errors have been found for this template.
            </TextWrapper>
          }
          <TextWrapper styles={{ size: "26px" }}>
              Processing Errors have been found for this template.
          </TextWrapper>
          <ButtonWrapper>
            { results.processingErrors.length > 0 &&
            <ExportErrorsButton errors={results.processingErrors}><ExcelExport/>
            Export Processing Errors
            </ExportErrorsButton>
            }
            <ExportSuccessButton successfulRows={results.successfullyProcessedRows}><ExcelExport/>
              Export Successful Rows
            </ExportSuccessButton>
            <StyledExportButton  onClick={handleClose}>
              Close
            </StyledExportButton>
          </ButtonWrapper>
        </ValidationErrorWrapper>
      }
    </ModalWrapper>
  );
};

export default ProcessingModal;