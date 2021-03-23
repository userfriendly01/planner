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
    callbackMethods,
    data,
    saveResult
  } = props;

  console.log("Data", data);
  const isWorkerDid = data.selectedWorker.attributes.did;
  const isForwardToSet = data.selectedWorker.inactiveForwardTo ? true : false;

  console.log("Did present?", data.selectedWorker.attributes.did);
  console.log("IsForwardToSet? ", isForwardToSet);

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
            workers={data.workers}
            skills={data.skills}
            updateForwardTo={forwardTo => callbackMethods.setForwardTo(forwardTo)}
          />
          : null
        }
        <ButtonWrapper>
          { isWorkerDid && !isForwardToSet ?
            <Button disabled={true} onClick={callbackMethods.onConfirm} data-testid={"disabled-confirm-button"}>
              Confirm
            </Button>
            :
            <Button onClick={callbackMethods.onConfirm} data-testid={"confirm-button"}>
              Confirm
            </Button>
          }
          <Button onClick={callbackMethods.handleClose} data-testid={"cancel-button"}>
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
