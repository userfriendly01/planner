import {
  Button,
  ButtonWrapper,
  ConfirmationText,
  Data,
  ModalContainer
} from "./ConfirmationModal.Styles";
import {
  ForwardToEntryForm,
  ModalOverlay,
  PaperContainer
} from "components";
import PropTypes from "prop-types";
import React from "react";

const ConfirmationModal = props => {
  const {
    callbackMethods,
    data,
    saveResult
  } = props;

  const isWorkerDid = data.selectedWorker.directDialNum;
  const isForwardToSet = data.selectedWorker.inactiveForwardTo ? true : false;

  return (
    <ModalContainer>
      <PaperContainer>
        {saveResult.status !== null ?
          <ModalOverlay
            message={saveResult.message}
            status={saveResult.status}
            handleClose={callbackMethods.handleClose}
          /> : null}
        <ConfirmationText>{data.confirmationText}</ConfirmationText>
        <Data>{data.displayData}</Data>
        { isWorkerDid ?
          <ForwardToEntryForm
            label={"This user has a direct dial number. Please choose a forward to option before confirming."}
            workers={data.workers}
            skills={data.skills}
            updateForwardTo={forwardTo => callbackMethods.setForwardTo(forwardTo)}
          />
          : null
        }
        <ButtonWrapper>
          { isWorkerDid && !isForwardToSet ?
            <Button disabled={true} onClick={callbackMethods.onConfirm}>
              Confirm
            </Button>
            :
            <Button onClick={callbackMethods.onConfirm}>
              Confirm
            </Button>
          }
          <Button onClick={callbackMethods.handleClose}>
            Cancel
          </Button>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

ConfirmationModal.propTypes = {
  callbackMethods: PropTypes.shape({
    handleClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    setForwardTo: PropTypes.func.isRequired
  }).isRequired,
  data: PropTypes.shape({
    confirmationText: PropTypes.string.isRequired,
    displayData: PropTypes.string.isRequired,
    selectedWorker: PropTypes.object.isRequired,
    skills: PropTypes.string,
    workers: PropTypes.string
  }).isRequired,
  saveResult: PropTypes.shape({
    status: PropTypes.string,
    message: PropTypes.string
  }).isRequired
};

export default ConfirmationModal;
