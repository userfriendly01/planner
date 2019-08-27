import { CloseRounded } from "@material-ui/icons";
import {
  CustomButton,
  ModalHelperText,
  ModalHeader,
  ModalNNumber,
  ModalOverlay,
  PaperContainer
} from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import {
  apiPaths,
  nNumMatcher
} from "globals";
import PropTypes from "prop-types";
import React, {
  useEffect,
  useState
} from "react";
import styled from "styled-components";
import { myAxios } from "utils";

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

const loadingStates = {
  success: "success",
  fail: "fail",
  loading: "loading",
  userNotFound: "User not found"
};

const defaultManager = {};
const defaultNNumber = "n";

const AddManagerModal = props => {
  const {
    handleClose
  } = props;

  const [manager, setManager] = useState(defaultManager);
  const [saveManager, setSaveManager] = useState(null);
  const [nNumber, setNNumber] = useState(defaultNNumber);

  const dispatch = useAdminDispatch();
  const state = useAdminState();

  const addManagerClicked = () => {
    setSaveManager(loadingStates.loading);
    if (!state.managerContext.managers.find(mgr => mgr.manager_n_number === nNumber)) {
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

  const clearManager = () => {
    setManager(defaultManager);
    setNNumber(defaultNNumber);
  };

  const isValidNNumber = nNumber.match(nNumMatcher);

  useEffect(() => {
    if (isValidNNumber) {
      setManager(loadingStates.loading);
      myAxios
        .get(apiPaths.EMPLOYEE_LOOKUP(nNumber.substring(1)))
        .then(res => {
          if (res.data.length !== 0) {
            const rawManager = res.data[0];
            setManager({
              manager_first_name: rawManager.person.data.FirstName,
              manager_last_name: rawManager.person.data.LastName,
              manager_n_number: nNumber
            });
          } else {
            setManager(loadingStates.userNotFound);
          }
        })
        .catch(err => {
          setManager(loadingStates.fail);
          console.error("Failed to lookup manager by nNumber", err);
        });
    }
  }, [nNumber]);

  const isManagerValid = manager.manager_n_number ? true : false;

  return (
    <ModalContainer>
      <PaperContainer>
        {saveManager === loadingStates.success || saveManager === loadingStates.fail ?
        // can we pass one prop 'options'?
          <ModalOverlay
            status={saveManager}
            successMessage={"Manager added successfully"}
            failMessage={"Manager already exists"}
          /> : null}
        <HeaderAndCloseButtonWrapper>
          <LeftDiv></LeftDiv>
          <ModalHeader>Add a Manager</ModalHeader>
          <CloseRounded onClick={handleClose}/>
        </HeaderAndCloseButtonWrapper>
        <FlexColumn>
          <ModalNNumber
            disabled={saveManager === loadingStates.loading || manager === loadingStates.loading}
            label="Manager N Number"
            name="Manager N Number"
            loading={manager === loadingStates.loading}
            nNumber={nNumber}
            updateValue={setNNumber}
          />
          {isManagerValid
            ? <ModalHelperText clearUser={clearManager} success={isManagerValid} message={`${manager.manager_first_name} ${manager.manager_last_name}`}/>
            : null
          }
        </FlexColumn>
        <ButtonWrapper>
          <CustomButton disabled={!isManagerValid} onClick={addManagerClicked}>
            Add Manager
          </CustomButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

AddManagerModal.propTypes = {
  handleClose: PropTypes.func.isRequired
};

export default AddManagerModal;
