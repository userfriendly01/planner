import {
  ButtonWrapper,
  Button,
  ModalWrapper,
  TextWrapper,
  ProcessingResultsWrapper
} from "usermanagement/BulkChanges.Styles";
import {
  ProcessingModalProps,
  PROCESSING_STATES
} from "usermanagement/BulkChanges.Interfaces";
import { ExportErrorsButton } from "usermanagement/ExportErrorsButton";
import { ExportSuccessButton } from "usermanagement/ExportSuccessButton";
import {
  initiateCalls, identifySuccessfulRecords
} from "usermanagement/processingUtils";
import { performValidations } from "usermanagement/validationUtils";
import { ProgressBar } from "./ProgressBar";
import {
  useAdminState,
  useAdminDispatch
} from "context/appContext";
import React from "react";
import { logger } from "utils/logger";

export const ProcessingModal = (props: ProcessingModalProps) => {
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
  const dispatch = useAdminDispatch();
  const [ status, setStatus ] = React.useState<PROCESSING_STATES>(PROCESSING_STATES.VALIDATING);
  const [ processedRows, setProcessedRows ] = React.useState(0);

  logger.log("we're in the processing modal!", {
    results,
    status,
    processedRows,
    uploadedForm
  });

  React.useEffect(() => {
    const initiateValidations = async () => {
      try {
        await performValidations(uploadedForm, selectedTemplates, consolidatedFieldsList, setProcessedRows, state);
        setResults({
          ...results,
          successfullyValidatedRows: uploadedForm
        });
        setStatus(PROCESSING_STATES.VALIDATED);
      } catch (err) {
        const successfullyValidatedRows = identifySuccessfulRecords(uploadedForm, err);
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
      const successfullyProcessedRows = await initiateCalls(rowsToProcess, selectedTemplates, setProcessedRows, state, dispatch);
      setResults({
        ...results,
        successfullyProcessedRows
      });

      setStatus(PROCESSING_STATES.PROCESSED);
      logger.log("PROCESSING IS DONE!!", results);
    } catch(error){
      logger.log("PROCESSING IS DONE BUT FAILED!!", error);
      setResults({
        ...results,
        processingErrors: error.errors,
        successfullyProcessedRows: error.success
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
              <ExportErrorsButton errors={results.processingErrors}>
                Export Processing Errors
              </ExportErrorsButton>
            }
            { results.successfullyProcessedRows.length > 0 &&
              <ExportSuccessButton successfulRows={results.successfullyProcessedRows}>
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