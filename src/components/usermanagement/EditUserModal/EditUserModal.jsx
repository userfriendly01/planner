//This modal will pull in the current user & display their user name as read only as well as a dropdown that feeds from the managers list within the context.
//? Do we want to display the manager that's currently selected or a "select new manager" - start with Select for MVP
import {
  CustomButton,
  CustomSelect,
  ModalHeader,
  ModalOverlay,
  PaperContainer
} from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import {
  apiPaths
} from "globals";
import PropTypes from "prop-types";
import React, { useState } from "react";
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

const ModalContainer = styled(FlexColumn)`
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const defaultNNumber = "n";
//Is the default number where I should pull in the clicked employees n#
//If I can pass the lookup details, may not need to do addt axios call to get user deets
//Need to create a method in the service to edit user

const EditUserModal = props => {

  const {
    handleClose
  } = props;
  const dispatch = useAdminDispatch();
  const {
    managerContext: {
      managers
    }
  } = useAdminState();
  const [form, setForm] = useState({
    lookupInfo: {},
    nNumber: defaultNNumber,
    manager: "",
    outgoing: "",
    team: ""
  });
  const [loading, updateLoading] = useState({
    lookupUser: false,
    saveStatus: "saving",
    saveUser: false
  });
  const clearUser = () => {
    setForm({
      ...form,
      lookupError: null,
      lookupInfo: {},
      nNumber: defaultNNumber
    });
  };
  const saveUser = () => {
    updateLoading({
      ...loading,
      saveStatus: "saving",
      saveUser: true
    });
  };
  const parsedManager = JSON.parse(form.manager);
  const attributes = {
    did: `+1${form.outgoing.replace(/[\D]/g, "")}`,
    email: form.lookupInfo.email,
    full_name: `${form.lookupInfo.firstName} ${form.lookupInfo.lastName}`,
    manager_first_name: parsedManager.manager_first_name,
    manager_last_name: parsedManager.manager_last_name,
    manager_n_number: parsedManager.manager_n_number,
    n_number: form.nNumber.toLowerCase(),
    office_location_name: form.lookupInfo.officeName,
    office_location_number: form.lookupInfo.officeNumber,
    primary_dept_name: form.lookupInfo.departmentName,
    primary_dept_number: form.lookupInfo.departmentNumber,
    profile_id: form.team
  };
  myAxios
    .post(apiPaths.EDIT_WORKER, { attributes })
    .then(res => {
      clearUser();
      dispatch({
        type: "editWorker",
        payload: {
          id: form.nNumber,
          attributes
        }
      });
      updateLoading({
        ...loading,
        saveStatus: "success",
        saveUser: true
      });
      setTimeout(() => {
        updateLoading({
          ...loading,
          saveUser: false
        });
      }, 2000);
      console.log(res);
    })
    .catch(err => {
      updateLoading({
        ...loading,
        saveStatus: "fail",
        saveUser: true
      });
      setTimeout(() => {
        updateLoading({
          ...loading,
          saveUser: false
        });
      }, 2000);
      console.log(err);
    });

  const isLookupInfoEmpty = JSON.stringify(form.lookupInfo) === JSON.stringify({});
  const formReady = !isLookupInfoEmpty && form.team !== "" && form.manager !== "" && form.outgoing !== "";

  return (
    <ModalContainer>
      <PaperContainer>
        {loading.saveUser ?
          <ModalOverlay
            status={loading.saveStatus}
            message={loading.saveStatus === "success" ? "User added successfully" : "Failed to add user"}
          /> : null}
        <ModalHeader>
          {"Edit User"}
        </ModalHeader>
        <CustomSelect
          label={"Manager"}
          labelWidth={65}
          optionsList={managers}
          optionsDisplayFunc={option => {
            return {
              display: `${option.manager_first_name} ${option.manager_last_name}`,
              key: option.manager_n_number,
              value: JSON.stringify(option)
            };
          }}
          updateValue={newValue => setForm({
            ...form,
            manager: newValue
          })}
          value={form.manager}
        />
        <ButtonWrapper>
          <CustomButton disabled={!formReady} onClick={saveUser}>
            {"Add User"}
          </CustomButton>
          <CustomButton onClick={handleClose}>
            {"Close"}
          </CustomButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

EditUserModal.propTypes = {
  handleClose: PropTypes.func
};

export default EditUserModal;