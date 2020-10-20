import {
  PaperContainer,
  ModalOverlay,
  StyledButton
} from "components";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";

const FlexColumn = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
`;

const FlexRow = styled.div`
  display: flex;
  flex: 1 1 auto;
`;

const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 1%;
`;

const Text = styled.h2`
  display: flex;
  text-align: center;
  line-height: 3;
  font-size: 20px;
  padding: 10px;
  height: 140px;
`;

const ModalContainer = styled(FlexColumn)`
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 2%;
  transform: translate(-50%, -50%);
`;

const loadingStates = {
  success: "success",
  fail: "fail",
  loading: "loading",
  userNotFound: "user-not-found"
};

const ConfirmationModal = props => {
  const {
    confirmFunction,
    confirmationText,
    handleClose
  } = props;

  const [saveResult, setSaveResult] = useState(null);

  const handleConfirm = () => {
    setSaveResult(loadingStates.saving);
    confirmFunction().then(() => {
      setSaveResult(loadingStates.success);
      setTimeout(() => handleClose(), 2000);
    }).catch(() => {
      setSaveResult(loadingStates.fail);
      setTimeout(() => handleClose(), 2000);
    });
  };

  let overlayMessage = "Saving";
  if (saveResult === loadingStates.success) {
    overlayMessage = "Operation Was Successful!";
  } else if (saveResult === loadingStates.fail) {
    overlayMessage = "Operation Failed.";
  }

  return (
    <ModalContainer>
      <PaperContainer>
        {saveResult === loadingStates.success || saveResult === loadingStates.fail ?
          <ModalOverlay
            message={overlayMessage}
            modal={true}
            status={saveResult}
          /> : null}
        <Text>{confirmationText}</Text>
        <ButtonWrapper>
          <StyledButton onClick={handleConfirm} data-testid={"confirm-button"}>
            Confirm
          </StyledButton>
          <StyledButton onClick={handleClose} data-testid={"cancel-button"}>
            Cancel
          </StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

ConfirmationModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  confirmFunction: PropTypes.func.isRequired,
  confirmationText: PropTypes.string.isRequired
};

export default ConfirmationModal;
