import {
  Button,
  ButtonWrapper,
  ConfirmationText,
  ModalContainer
} from "./CallFlowConfirmationModal.Styles";
import { CallFlowConfirmationModalProps } from "../CallFlowManagement.Interfaces";
import {
  ModalOverlay,
  PaperContainer
} from "components";
import React from "react";

const CallFlowConfirmationModal = (props: CallFlowConfirmationModalProps) => {
  const {
    confirmationModalOpts,
    saveResult
  } = props;

  const handleClose = confirmationModalOpts.callbackMethods.handleClose;
  const onConfirm = confirmationModalOpts.callbackMethods.onConfirm;

  return (
    <ModalContainer>
      <PaperContainer>
        {saveResult.status !== null ?
          <ModalOverlay
            message={saveResult.message}
            status={saveResult.status}
            handleClose={handleClose}
          /> : null}
        <ConfirmationText>{confirmationModalOpts.confirmationText}</ConfirmationText>
        <ButtonWrapper>
          <Button onClick={onConfirm}>
            Confirm
          </Button>
          <Button onClick={handleClose}>
            Cancel
          </Button>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

export default CallFlowConfirmationModal;
