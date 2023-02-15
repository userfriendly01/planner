import {
  ButtonWrapper,
  Button,
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
  const [ status, setStatus ] = React.useState<PROCESSING_STATES>(PROCESSING_STATES.VALIDATING);
  const [ processedRows, setProcessedRows ] = React.useState(0);

  console.log("we're in the processing modal! results", results );
  console.log("we're in the processing modal! status", status );
  console.log("we're in the processing modal! processedRows", processedRows );
  console.log("we're in the processing modal! uploadedForm", uploadedForm );

  React.useEffect(() => {
    const initiateValidations = async () => {
      console.warn("we get in here", status);
      try {
        await performValidations(uploadedForm, selectedTemplates, consolidatedFieldsList, setProcessedRows, state);
        setResults({
          ...results,
          successfullyValidatedRows: uploadedForm
        });
        setStatus(PROCESSING_STATES.VALIDATED);
      } catch (err) {
        console.log("Validation Errors Log", err);
        const errors = typeof err === "object" ? err : [ { error: "unexpected error response" }];
        const successfullyValidatedRows = identifySuccessfulRecords(uploadedForm, errors);
        setResults({
          ...results,
          validationErrors: err,
          successfullyValidatedRows
        });
        setStatus(PROCESSING_STATES.VALIDATED);
      }
    };
    initiateValidations();
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
      { status === PROCESSING_STATES.VALIDATING && <ProgressBar completedRows={processedRows} totalRowCount={uploadedForm.length}/> }
      { status === PROCESSING_STATES.VALIDATED &&
        <ProcessingResultsWrapper>
          <TextWrapper styles={{
            size: "26px"
          }}>
            {results.validationErrors.length} Validation Errors have been found for this template.
          </TextWrapper>
          <ButtonWrapper>
            <Button onClick={handleClose}>
              Cancel
            </Button>
            { results.validationErrors.length > 0 &&
              <ExportErrorsButton errors={results.validationErrors}>
                Export Validation Errors
              </ExportErrorsButton>
            }
            <Button onClick={handleStartProcessing}>
              Process {results.successfullyValidatedRows.length} out of {uploadedForm.length} rows
            </Button>
          </ButtonWrapper>
        </ProcessingResultsWrapper>
      }
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
            { results.successfullyProcessedRows.length > 0 &&
              <ExportSuccessButton successfulRows={results.successfullyProcessedRows}><ExcelExport/>
                Export Successful Rows
              </ExportSuccessButton>
            }
            <Button onClick={handleClose}>
              Close
            </Button>
          </ButtonWrapper>
        </ProcessingResultsWrapper>
      }
    </ModalWrapper>
  );
};

export default ProcessingModal;