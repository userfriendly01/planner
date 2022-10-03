import {
  Button,
  ButtonWrapper,
  ConfirmationText,
  ModalContainer
} from "./CallFlowConfirmationModal.Styles";
import { CallFlowConfirmationModalProps } from "./CallFlowConfirmationModal.Interfaces";
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
          <Button onClick={onConfirm}>
            Confirm
          </Button>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

export default CallFlowConfirmationModal;
