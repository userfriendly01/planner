import {
  Button,
  ButtonWrapper,
  ConfirmationText,
  ModalContainer
} from "./CallFlowConfirmationModal.Styles";
import { CallFlowConfirmationModalProps } from "./CallFlowConfirmationModal.Interfaces";
import { ModalOverlay } from "components/ModalOverlay";
import { PaperContainer } from "components/PaperContainer";
import ExportButton from "callflowmanagement/ExportButton";
import React from "react";

export const CallFlowConfirmationModal = (props: CallFlowConfirmationModalProps) => {
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