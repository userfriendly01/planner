import { CloseRounded } from "@material-ui/icons";
import {
  ModalNNumber,
  ModalOverlay,
  PaperContainer,
  StyledButton
} from "components";
import {
  Manager,
  useAdminDispatch,
  useAdminState
} from "context";
import React, { useState } from "react";
import { FetchUserResponse } from "services";
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

const Header = styled.h1`
  align-self: center;
`;

const HeaderAndCloseButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LeftDiv = styled.div`
  width: 1em;
`;

const ModalContainer = styled(FlexColumn)`
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const defaultNNumber = "n";
const loadingStates = {
  success: "success",
  fail: "fail",
  loading: "loading"
};

export interface AddManagerModalProps {
  handleClose: () => void
}

const AddManagerModal = (props: AddManagerModalProps) => {
  const { handleClose } = props;

  const [manager, setManager] = useState<Manager>(null);
  const [saveStatus, setSaveStatus] = useState<string>(null);
  const [nNumber, setNNumber] = useState<string>(defaultNNumber);
  const [fetchedUser, setFetchedUser] = useState<FetchUserResponse>(null);

  const dispatch = useAdminDispatch();
  const state = useAdminState();

  const addManagerClicked = () => {
    setSaveStatus(loadingStates.loading);
    if (!state.managerContext.managers.some(mgr => mgr.manager_n_number.toLowerCase() === nNumber.toLowerCase())) {
      dispatch(({
        type: "addManager",
        payload: { manager }
      }));
      setSaveStatus(loadingStates.success);
      setTimeout(handleClose, 2000);
    } else {
      setSaveStatus(loadingStates.fail);
      setTimeout(() => setSaveStatus(null), 2000);
    }
  };

  let overlayMessage = "Saving";
  if (saveStatus === loadingStates.success) {
    overlayMessage = "Manager added successfully";
  } else if (saveStatus === loadingStates.fail) {
    overlayMessage = "Manager already exists";
  }

  return (
    <ModalContainer>
      <PaperContainer>
        {saveStatus ?
          <ModalOverlay
            message={overlayMessage}
            status={saveStatus}
          /> : null}
        <HeaderAndCloseButtonWrapper>
          <LeftDiv></LeftDiv>
          <Header>Add a Manager</Header>
          <CloseRounded data-testid={"close-button"} onClick={handleClose}/>
        </HeaderAndCloseButtonWrapper>
        <FlexColumn>
          <ModalNNumber
            disabled={saveStatus ? true : false}
            fetchedUser={fetchedUser}
            label="N Number"
            onComplete={(fetchedUser, nNumber) => {
              setNNumber(nNumber);
              setManager({
                manager_n_number: nNumber,
                manager_first_name: fetchedUser.firstName,
                manager_last_name: fetchedUser.lastName
              });
              setFetchedUser(fetchedUser)
            }}
            onClear={() => {
              setNNumber(defaultNNumber);
              setManager(null);
            }}
            onUpdate={nNumber => {
              setNNumber(nNumber)
            }}
            value={nNumber}
          />
        </FlexColumn>
        <ButtonWrapper>
          <StyledButton disabled={!manager} onClick={addManagerClicked} data-testid={"add-manager-button"}>
            Add Manager
          </StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

export default AddManagerModal;
