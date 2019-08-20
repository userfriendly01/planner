import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import {
  ButtonBase,
  Paper,
  TextField
} from "@material-ui/core";
import { ModalOverlay } from "components";
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
import styled, {
  keyframes
} from "styled-components";
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

const Spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const ButtonWrapper = styled(FlexRow)`
  justify-content: space-around;
  padding: 1%;
`;

const ClearButton = styled.button`
  background-color: #AAEDED;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Roboto',sans-serif;
  outline: none;
`;

const CustomButton = styled(ButtonBase)`
  && {
    opacity: ${props => props.disabled ? ".5" : "1"};
    background-color: #AAEDED;
    border: none;
    border-radius: 3px;
    color: #1A1446;
    cursor: pointer;
    font-size: 1.2em;
    outline: none;
    padding: 5 10 5 10;
  }
`;

const FetchingRing = styled.div`
  display: inline-block;
  width: 64px;
  height: 64px;
  &:after {
    content: " ";
    display: block;
    width: 46px;
    height: 46px;
    margin: 1px;
    border-radius: 50%;
    border: 5px solid #AAEDED;
    border-color: #AAEDED transparent #AAEDED transparent;
    animation: ${Spin} 1.2s linear infinite;
  }
`;

const Header = styled.div`
  align-self: center;
  color: #1A1446;
  font-family: 'Roboto', sans-serif;
  font-size: 3rem;
  font-weight: 400;
  letter-spacing: 0rem;
  line-height: 1.30357em;
  margin: 2%;
`;

const HeaderAndCloseButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HelperText = styled(FlexRow)`
  color: ${props => props.error ? "red" : "green"};
  font-family: 'Roboto', sans-serif;
  font-size: 0.8em;
  font-weight: 800;
  line-height: 1.2em;
  justify-content: space-between;
  margin: -1% 4% 2% 4%;
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

const PaperContainer = styled(Paper)`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 400px;
  padding: 2%;
  position: relative;
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

  let helperText = null;
  if (JSON.stringify(form.lookupInfo) !== JSON.stringify({})) {
    helperText =
      <HelperText>
        <div>{form.lookupInfo.firstName} {form.lookupInfo.lastName}</div>
        <ClearButton onClick={clearManager}>X</ClearButton>
      </HelperText>;
  } else if (form.lookupError) {
    helperText = <HelperText error>{form.lookupError}</HelperText>;
  }

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
          <Header>Add a Manager</Header>
          <CloseRoundedIcon onClick={handleClose} tooltip="Close Add Manager Modal"/> {/* TODO: tooltip & hover */}
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
            {loading.lookupManager ? <FetchingRing /> : null}
          </FlexRow>
          {helperText}
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
