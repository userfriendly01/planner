import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import { TextField } from "@material-ui/core";
import {
  CustomButton,
  ModalFetchingRing,
  ModalHelperText,
  ModalHeader,
  ModalOverlay,
  PaperContainer
} from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import { apiPaths } from "globals";
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

const TextInput = styled(TextField)`
  flex-grow: 1;
  && {
    margin: 2%;
  }
`;

const AddManagerModal = props => {
  const {
    handleClose
  } = props;

  const nNumMatcher = /[n,N]\d{7}/g;

  const [disableNNumber, setDisableNNumber] = useState(false);
  const [form, setForm] = useState({
    lookupInfo: {},
    nNumber: "N"
  });
  const [formReady, setFormReady] = useState(false);
  const [loading, updateLoading] = useState({
    lookupManager: false,
    saveManager: false,
    saveStatus: "saving"
  });
  const dispatch = useAdminDispatch();
  const state = useAdminState();

  const saveManager = () => {
    updateLoading({
      ...loading,
      saveStatus: "saving",
      saveUser: true
    });
    const manager = {
      manager_first_name: form.lookupInfo.firstName,
      manager_last_name: form.lookupInfo.lastName,
      manager_n_number: form.nNumber
    };
    const newManagerNNumber = manager.manager_n_number;
    const listOfCurrentManagers = state.managerContext.managers;
    if (!listOfCurrentManagers.some(existingManager => existingManager.manager_n_number === newManagerNNumber)) {
      dispatch(({
        type: "addManager",
        payload: {
          manager
        }
      }));
      updateLoading({
        ...loading,
        saveManager: true,
        saveStatus: "success"
      });
      setTimeout(() => {
        updateLoading({
          ...loading,
          saveManager: false
        });
        handleClose();
      }, 2000);
    } else {
      updateLoading({
        ...loading,
        saveManager: true,
        saveStatus: "fail"
      });
      setTimeout(() => {
        updateLoading({
          ...loading,
          saveManager: false
        });
      }, 2000);
    }
  };

  const clearManager = () => {
    setForm({
      ...form,
      lookupError: null,
      lookupInfo: {},
      nNumber: "N"
    });
    setDisableNNumber(false);
  };

  useEffect(() => {
    if (form.nNumber.match(nNumMatcher)) {
      updateLoading({
        ...loading,
        lookupManager: true
      });
      myAxios
        .get(apiPaths.EMPLOYEE_LOOKUP(form.nNumber.substring(1)))
        .then(res => {
          if (res.data.length !== 0) {
            setForm({
              ...form,
              lookupError: null,
              lookupInfo: {
                email: res.data[0].person.data.Email,
                firstName: res.data[0].person.data.FirstName,
                lastName: res.data[0].person.data.LastName,
                officeName: res.data[0].person.data.OfficeName,
                officeNumber: res.data[0].person.data.OfficeNumber,
                departmentName: res.data[0].person.data.DepartmentName,
                departmentNumber: res.data[0].person.data.DepartmentNumber
              }
            });
            setDisableNNumber(true);
          } else {
            setForm({
              ...form,
              lookupInfo: {},
              lookupError: "User not found"
            });
          }
        })
        .catch(err => {
          setForm({
            ...form,
            lookupInfo: {},
            lookupError: `Error calling lookup service: ${err.message}`
          });
        })
        .finally(() => {
          updateLoading({
            ...loading,
            lookupManager: false
          });
        });
    }
  }, [form.nNumber]);

  useEffect(() => {
    if (JSON.stringify(form.lookupInfo) !== JSON.stringify({}) && form.team !== "" && form.manager !== "" && form.outgoing !== "") {
      setFormReady(true);
    } else {
      setFormReady(false);
    }
  }, [form]);

  return (
    <ModalContainer>
      <PaperContainer>
        {loading.saveManager ?
          <ModalOverlay
            status={loading.saveStatus}
            successMessage={"Manager added successfully"}
            failMessage={"Manager already exists"}
          /> : null}
        <HeaderAndCloseButtonWrapper>
          <LeftDiv></LeftDiv>
          <ModalHeader>Add a Manager</ModalHeader>
          <CloseRoundedIcon onClick={handleClose} tooltip="Close Add Manager Modal"/>
        </HeaderAndCloseButtonWrapper>
        <FlexColumn>
          <FlexRow>
            <TextInput
              disabled={disableNNumber}
              id="outlined-nNumber-input"
              inputProps={{ maxLength: "8" }}
              label="Manager N Number"
              name="Manager N Number"
              onChange={event =>
                setForm({
                  ...form,
                  nNumber: event.target.value
                })
              }
              margin="normal"
              variant="outlined"
              value={form.nNumber}
            />
            {loading.lookupManager ? <ModalFetchingRing /> : null}
          </FlexRow>
          <ModalHelperText clearUser={clearManager} error={form.lookupError} lookupInfo={form.lookupInfo} />
        </FlexColumn>
        <ButtonWrapper>
          <CustomButton disabled={!formReady} onClick={saveManager}>
            Add Manager
          </CustomButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

AddManagerModal.propTypes = {
  handleClose: PropTypes.func
};

export default AddManagerModal;
