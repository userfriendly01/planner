import React, { ReactElement } from "react";
import {
  Modal, ModalHeader
} from "@lmig/lmds-react-modal";
import styled from "styled-components";
import { ModalFooterStyled } from "dynamicCallFlowCommon/DynamicCallFlow.Styles";
import { Button } from "@mui/material";

const ConfirmationMessage = styled.h2`
    display: flex;
    font-size: 18px;
    padding: 0 10px 0 10px;
    text-align: center;
    align-items: center;
    align-self: center;
    line-height: 2;
    min-height: 150px;
`;

export interface ConfirmationModalProps {
  confirmationAction: () => void;
  closeConfirmationModal: () => void;
  isOpen: boolean;
  confirmationMessage: string;
  confirmationButtonText?: string;
}

export const ConfirmationModal = (
  {
    confirmationAction,
    closeConfirmationModal,
    isOpen,
    confirmationMessage,
    confirmationButtonText = "Confirm"
  } : ConfirmationModalProps
): ReactElement => {
  const onConfirmation = () => {
    closeConfirmationModal();
    confirmationAction();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeConfirmationModal}
      size="small"
    >
      <ModalHeader>
        <ConfirmationMessage>{confirmationMessage}</ConfirmationMessage>
      </ModalHeader>
      <ModalFooterStyled>
        <Button
          variant="contained"
          color="error"
          value="Confirm"
          sx={{ marginRight: 2 }}
          onClick={onConfirmation}>
          {confirmationButtonText}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          value="Cancel"
          sx={{ marginRight: 2 }}
          onClick={closeConfirmationModal}>
          Cancel
        </Button>
      </ModalFooterStyled>
    </Modal>
  );
};
