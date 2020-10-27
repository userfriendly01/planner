import { CloseRounded } from "@material-ui/icons";
import {
  ModalNNumber,
  PaperContainer,
  ModalOverlay,
  StyledButton
} from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
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

const defaultManager = {};
const defaultNNumber = "n";
const loadingStates = {
  success: "success",
  fail: "fail",
  loading: "loading",
  userNotFound: "user-not-found"
};

const AddManagerModal = props => {
  const { handleClose } = props;

  const [manager, setManager] = useState(defaultManager);
  const [saveManager, setSaveManager] = useState(null);
  const [nNumber, setNNumber] = useState(defaultNNumber);

  const dispatch = useAdminDispatch();
  const state = useAdminState();

  const addManagerClicked = () => {
    setSaveManager(loadingStates.loading);
    if (!state.managerContext.managers.some(mgr => mgr.manager_n_number.toLowerCase() === nNumber.toLowerCase())) {
      dispatch(({
        type: "addManager",
        payload: { manager }
      }));
      setSaveManager(loadingStates.success);
      setTimeout(() => handleClose(), 2000);
    } else {
      setSaveManager(loadingStates.fail);
      setTimeout(() => setSaveManager(null), 2000);
    }
  };

  const [ isNNumberValid, setNNumberValid ] = useState(false);

  let overlayMessage = "Saving";
  if (saveManager === loadingStates.success) {
    overlayMessage = "Manager added successfully";
  } else if (saveManager === loadingStates.fail) {
    overlayMessage = "Manager already exists";
  }

  return (
    <ModalContainer>
      <PaperContainer>
        {saveManager === loadingStates.success || saveManager === loadingStates.fail ?
          <ModalOverlay
            message={overlayMessage}
            status={saveManager}
          /> : null}
        <HeaderAndCloseButtonWrapper>
          <LeftDiv></LeftDiv>
          <Header>Add a Manager</Header>
          <CloseRounded data-testid={"close-button"} onClick={handleClose}/>
        </HeaderAndCloseButtonWrapper>
        <FlexColumn>
          <ModalNNumber
            disabled={saveManager === loadingStates.loading || manager === loadingStates.loading || isNNumberValid}
            nNumber={nNumber}
            updateValue={res => setNNumber(res.nNumber)}
            resetParentState={() => {
              setNNumber(defaultNNumber);
              setManager(defaultManager);
            }}
            setIsValid={setNNumberValid}
          />
        </FlexColumn>
        <ButtonWrapper>
          <StyledButton disabled={!isNNumberValid} onClick={addManagerClicked} data-testid={"add-manager-button"}>
            Add Manager
          </StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

AddManagerModal.propTypes = {
  handleClose: PropTypes.func.isRequired
};

export default AddManagerModal;
