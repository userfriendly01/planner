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
  // useEffect,
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

const AddManagerModal = props => {
  const {
    handleClose
  } = props;

  const [manager, setManager] = useState(null);
  const [saveManager, setSaveManager] = useState(null);
  const [nNumber, setNNumber] = useState(null);

  const dispatch = useAdminDispatch();
  const state = useAdminState();

  const addManagerClicked = () => {
    setSaveManager(loadingStates.loading);
    // const manager = {
    //   manager_first_name: form.lookupInfo.firstName,
    //   manager_last_name: form.lookupInfo.lastName,
    //   manager_n_number: form.nNumber
    // };
    const newManagerNNumber = manager.manager_n_number;
    const listOfCurrentManagers = state.managerContext.managers;
    if (!listOfCurrentManagers.some(existingManager => existingManager.manager_n_number === newManagerNNumber)) {
      dispatch(({
        type: "addManager",
        payload: {
          manager
        }
      }));
      setSaveManager(loadingStates.success);
      setTimeout(() => handleClose(), 2000);
    } else {
      setSaveManager(loadingStates.fail);
      setTimeout(() => setSaveManager(null), 2000);
    }
  };

  const clearManager = () => {
    // setForm({
    //   ...form,
    //   lookupError: null,
    //   lookupInfo: {},
    //   nNumber: "N"
    // });
    setManager(null);
    setNNumber("N");
  };

  const isValidNNumber = nNumber.match(nNumMatcher);

  if (isValidNNumber) {
    setManager(loadingStates.loading);
    myAxios
      .get(apiPaths.EMPLOYEE_LOOKUP(nNumber.substring(1)))
      .then(res => {
        if (res.data.length !== 0) {
          setManager({
            email: res.data[0].person.data.Email,
            firstName: res.data[0].person.data.FirstName,
            lastName: res.data[0].person.data.LastName,
            officeName: res.data[0].person.data.OfficeName,
            officeNumber: res.data[0].person.data.OfficeNumber,
            departmentName: res.data[0].person.data.DepartmentName,
            departmentNumber: res.data[0].person.data.DepartmentNumber
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
            // disabled={JSON.stringify(form.lookupInfo) !== "{}"}
            disabled={!isManagerValid}
            label="Manager N Number"
            name="Manager N Number"
            loading={manager === loadingStates.loading}
            nNumber={nNumber}
            updateValue={setNNumber}
          />
          {/* <ModalHelperText clearUser={clearManager} error={manager === loadingStates.fail ? } lookupInfo={form.lookupInfo} /> */}
          <ModalHelperText clearUser={clearManager} success={isManagerValid} message={"whatever"}/>
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
