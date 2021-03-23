import {
  PaperContainer,
  ModalOverlay,
  StyledButton
} from "components";
import ForwardToEntryForm from "./ForwardToEntryForm";
import PropTypes from "prop-types";
import React from "react";
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
  height: 50px;
`;

const Button = styled(StyledButton)`
  height: 40;
  width: 100;
`;

const ConfirmationText = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  padding: 0px 10px 0px 10px ;
  height: 60px;
`;

const Data = styled.h2`
  display: flex;
  justify-content: center;
  align-items: baseline;
  font-size: 23px;
  padding: 0px 10px 0px 10px ;
  height: 60px;
`;

const ModalContainer = styled(FlexColumn)`
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 2%;
  transform: translate(-50%, -50%);
`;

const ConfirmationModal = props => {
  const {
    onConfirm,
    body,
    handleClose,
    saveResult,
    workers,
    skills
  } = props;

  return (
    <ModalContainer>
      <PaperContainer>
        {saveResult.status !== null ?
          <ModalOverlay
            message={saveResult.message}
            status={saveResult.status}
            handleClose={handleClose}
          /> : null}
        <ConfirmationText>{body.confirmationText}</ConfirmationText>
        <Data>{body.data}</Data>
        <ForwardToEntryForm
          workers={workers}
          skills={skills}
          updateForwardTo={() => console.log("Updated!")}
        />
        <ButtonWrapper>
          <Button disabled={true} onClick={onConfirm} data-testid={"confirm-button"}>
            Confirm
          </Button>
          <Button onClick={handleClose} data-testid={"cancel-button"}>
            Cancel
          </Button>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

ConfirmationModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  body: PropTypes.shape({
    confirmationText: PropTypes.string,
    data: PropTypes.string
  }).isRequired,
  saveResult: PropTypes.shape({
    status: PropTypes.string,
    message: PropTypes.string
  }).isRequired,
  skills: PropTypes.array.isRequired,
  workers: PropTypes.arrayOf(
    PropTypes.shape({
      attributes: PropTypes.object,
      id: PropTypes.string,
      sid: PropTypes.string
    })
  )
};

export default ConfirmationModal;
