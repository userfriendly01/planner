import {
  Button,
  ButtonWrapper,
  ConfirmationText,
  ModalContainer,
  CallFlowConfirmationModalProps
} from "./";
import {
  ModalOverlay,
  PaperContainer,
  ExportButton
} from "components";
import React from "react";

const CallFlowConfirmationModal = (props: CallFlowConfirmationModalProps) => {
  const {
    tableState,
    confirmationModalOpts,
    saveResult
  } = props;

  const handleClose = confirmationModalOpts.callbackMethods.handleClose;
  const onConfirm = confirmationModalOpts.callbackMethods.onConfirm;

  return (
    <ModalContainer>
      <PaperContainer>
        { saveResult.status !== null &&
          <ModalOverlay
            message={saveResult.message}
            status={saveResult.status}
            handleClose={handleClose}
          />
        }
        <ConfirmationText>{confirmationModalOpts.confirmationText}</ConfirmationText>
        <ButtonWrapper>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          { confirmationModalOpts.exportButton && <ExportButton selected={tableState.selected}/>}
          <Button onClick={onConfirm}>
            Confirm
          </Button>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

export default CallFlowConfirmationModal;
