import {
  ButtonWrapper,
  StyledExportButton,
  ModalWrapper,
  TextWrapper,
  ProcessingResultsWrapper
} from "../BulkChanges.Styles";
import {
  ProcessingModalProps,
  PROCESSING_STATES
} from "../BulkChanges.Interfaces";
import {
  ExportErrorsButton,
  ExportSuccessButton
} from "../ExportButtons";
import {
  performValidations,
  initiateCalls,
  identifySuccessfulRecords
} from "../BulkUtils";
import ProgressBar from "./ProgressBar";
import { useAdminState } from "context";
import React from "react";
import { ExcelExport } from "@progress/kendo-react-excel-export";

const ProcessingModal = (props: ProcessingModalProps) => {
  const {
    selectedTemplates,
    handleClose,
    consolidatedFieldsList,
    uploadedForm
  } = props;

  const [ results, setResults ] = React.useState({
    validationErrors: [],
    processingErrors: [],
    successfullyValidatedRows: [],
    successfullyProcessedRows: []
  });

  const state = useAdminState();
  const [ status, setStatus ] = React.useState<PROCESSING_STATES>(null);
  const [ processedRows, setProcessedRows ] = React.useState(null);

  console.log("we're in the processing modal! results", results );
  console.log("we're in the processing modal! status", status );
  console.log("we're in the processing modal! processedRows", processedRows );
  console.log("we're in the processing modal! uploadedForm", uploadedForm );

  React.useEffect(() => {
    setStatus(PROCESSING_STATES.VALIDATING);
    setTimeout(async () => {
      try {
        await performValidations(uploadedForm, selectedTemplates, consolidatedFieldsList, setProcessedRows, state);
        setResults({
          ...results,
          successfullyValidatedRows: uploadedForm
        });
        setStatus(PROCESSING_STATES.VALIDATED);
      } catch (err) {
        console.log("Validation Errors Log", err);
        const errors = typeof err === "object" ? err : [];
        const successfullyValidatedRows = identifySuccessfulRecords(uploadedForm, errors);
        setResults({
          ...results,
          validationErrors: err,
          successfullyValidatedRows
        });
        setStatus(PROCESSING_STATES.VALIDATED);
      }
    }, 1000);
  }, []);

  const handleStartProcessing = async () => {
    setStatus(PROCESSING_STATES.PROCESSING);
    setProcessedRows(0);
    const rowsToProcess = results.successfullyValidatedRows;
    try {
      const successfullyProcessedRows = await initiateCalls(rowsToProcess, selectedTemplates, setProcessedRows);
      setResults({
        ...results,
        successfullyProcessedRows
      });
      setStatus(PROCESSING_STATES.PROCESSED);
      console.log("PROCESSING IS DONE!!", results);
    } catch(err){
      console.log("PROCESSING IS DONE BUT FAILED!!", err);
      setResults({
        ...results,
        processingErrors: err.errors,
        successfullyProcessedRows: err.success
      });
      setStatus(PROCESSING_STATES.PROCESSED);
    }
  };

  return (
    <ModalWrapper>
      { status === PROCESSING_STATES.VALIDATED &&
        <ProcessingResultsWrapper>
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
        </ProcessingResultsWrapper>
      }
      { status === PROCESSING_STATES.VALIDATING && <ProgressBar completedRows={processedRows} totalRowCount={uploadedForm.length}/> }
      { status === PROCESSING_STATES.PROCESSING && <ProgressBar completedRows={processedRows} totalRowCount={results.successfullyValidatedRows.length}/> }
      { status === PROCESSING_STATES.PROCESSED &&
        <ProcessingResultsWrapper>
          { results.processingErrors.length > 0 ?
            <TextWrapper styles={{ size: "26px" }}>
              {results.processingErrors.length} processing errors were thrown for this template. {results.successfullyProcessedRows.length} successful rows.
            </TextWrapper>
            :
            <TextWrapper styles={{ size: "26px" }}>
              All rows were processed successfully!! Export success columns to see worker details.
            </TextWrapper>
          }
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
        </ProcessingResultsWrapper>
      }
    </ModalWrapper>
  );
};

export default ProcessingModal;