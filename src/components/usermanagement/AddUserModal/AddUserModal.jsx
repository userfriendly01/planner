import {
  ButtonBase,
  FormControl,
  InputLabel,
  OutlinedInput,
  Paper,
  Select,
  TextField
} from "@material-ui/core";
import { AdminUIContext } from "context";
import { apiPaths } from "globals";
import PropTypes from "prop-types";
import React, {
  useContext,
  useEffect,
  useState
} from "react";
import MaskedInput from "react-text-mask";
import styled, {
  keyframes
} from "styled-components";
import {
  myAxios
} from "utils";

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

const ClearButton = styled.button`
  background-color: #AAEDED;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Roboto',sans-serif;
  outline: none;
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

const FormField = styled(FormControl)`
  && {
    margin: 2%;
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

const HelperText = styled(FlexRow)`
  color: ${props => props.error ? "red" : "green"};
  font-family: 'Roboto', sans-serif;
  font-size: 0.8em;
  font-weight: 800;
  line-height: 1.2em;
  justify-content: space-between;
  margin: -1% 4% 2% 4%;
`;

const ModalContainer = styled(FlexColumn)`
  left: 50%;
  padding: 2%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const Overlay = styled(FlexRow)`
  align-items: center;
  background-color: black;
  border-radius: 4px;
  height: 100%;
  justify-content: center;
  left: 0;
  opacity: .5;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 100;
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

function TextMaskCustom(inputProps) {
  const {
    inputRef,
    ...other
  }  = inputProps;
  return (
    <MaskedInput
      {...other}
      guide={false}
      mask={["(", /[1-9]/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/]}
      placeholderChar={"\u2000"}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      showMask />
  );
}

const ManagementTable = props => {

  const nNumMatcher = /[n,N]\d{7}/g;
  const {
    handleClose,
    managerList
  } = props;
  const {
    profileContext: {
      profiles
    }
  } = useContext(AdminUIContext);
  const [disableNNumber, setDisableNNumber] = useState(false);
  const [form, setForm] = useState({
    lookupInfo: {},
    nNumber: "N",
    manager: "",
    outgoing: "",
    team: ""
  });
  const [formReady, setFormReady] = useState(false);
  const [loading, updateLoading] = useState({
    lookupUser: false,
    saveUser: false
  });

  useEffect(() => {
    if (form.nNumber.match(nNumMatcher)) {
      updateLoading({
        ...loading,
        lookupUser: true
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
              lookupError: "User Not Found"
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
            lookupUser: false
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
    console.log(form);
  }, [form]);

  const clearUser = () => {
    setForm({
      ...form,
      lookupError: null,
      lookupInfo: {},
      nNumber: "N"
    });
    setDisableNNumber(false);
  };

  const saveUser = () => {
    updateLoading({
      ...loading,
      saveUser: true
    });
    const parsedManager = JSON.parse(form.manager);
    myAxios
      .post(apiPaths.CREATE_WORKER, {
        attributes: {
          did: `+1${form.outgoing.replace(/[\D]/g, "")}`,
          email: form.lookupInfo.email,
          full_name: `${form.lookupInfo.firstName} ${form.lookupInfo.lastName}`,
          manager_first_name: parsedManager.manager_first_name,
          manager_last_name: parsedManager.manager_last_name,
          manager_n_number: parsedManager.manager_n_number,
          n_number: form.nNumber,
          office_location_name: form.lookupInfo.officeName,
          office_location_number: form.lookupInfo.officeNumber,
          primary_dept_name: form.lookupInfo.departmentName,
          primary_dept_number: form.lookupInfo.departmentNumber,
          profile_id: form.team
        }
      })
      .then(res => {
        setForm({
          ...form,
          lookupInfo: {},
          nNumber: "N"
        });
        setDisableNNumber(false);
        updateLoading({
          ...loading,
          saveUser: false
        });
        console.log(res);
      });
  };

  let helperText = null;
  if (JSON.stringify(form.lookupInfo) !== JSON.stringify({})) {
    helperText =
      <HelperText>
        <div>{form.lookupInfo.firstName} {form.lookupInfo.lastName}</div>
        <ClearButton onClick={clearUser}>X</ClearButton>
      </HelperText>;
  } else if (form.lookupError) {
    helperText = <HelperText error>{form.lookupError}</HelperText>;
  }

  return (
    <ModalContainer>
      <PaperContainer>
        {loading.saveUser ? <Overlay ><FetchingRing /></Overlay> : null}
        <Header>Add a User</Header>
        <FormField variant="outlined">
          <InputLabel htmlFor="outlined-selectedManager-native-simple">
            Manager
          </InputLabel>
          <Select
            native
            value={form.manager}
            onChange={event =>
              setForm({
                ...form,
                manager: event.target.value
              })
            }
            input={
              <OutlinedInput
                name="selectedManager"
                labelWidth={65}
                id="outlined-selectedManager-native-simple"
              />
            }
          >
            <option value="" />
            {managerList.map(manager => (
              <option
                key={manager.manager_n_number}
                value={JSON.stringify(manager)}
              >
                {manager.manager_first_name} {manager.manager_last_name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField variant="outlined">
          <InputLabel htmlFor="outlined-selectedTeam-native-simple">
            Team
          </InputLabel>
          <Select
            native
            value={form.team}
            onChange={event =>
              setForm({
                ...form,
                team: event.target.value
              })
            }
            input={
              <OutlinedInput
                name="selectedTeam"
                labelWidth={41}
                id="outlined-selectedTeam-native-simple"
              />
            }
          >
            <option value="" />
            {profiles.map(profile => (
              <option key={profile.profile_id} value={profile.profile_id}>
                {profile.profile_nme}
              </option>
            ))}
          </Select>
        </FormField>
        <TextInput
          id="outlined-outgoing-input"
          InputProps={{ inputComponent: TextMaskCustom }}
          label="Outgoing Number"
          name="Outgoing Number"
          onChange={event =>
            setForm({
              ...form,
              outgoing: event.target.value
            })
          }
          margin="normal"
          variant="outlined"
          value={form.outgoing}
        />
        <FlexColumn>
          <FlexRow>
            <TextInput
              disabled={disableNNumber}
              id="outlined-nNumber-input"
              inputProps={{ maxLength: "8" }}
              label="N Number"
              name="N Number"
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
            {loading.lookupUser ? <FetchingRing /> : null}
          </FlexRow>
          {helperText}
        </FlexColumn>
        <ButtonWrapper>
          <CustomButton disabled={!formReady} onClick={saveUser}>
            Add User
          </CustomButton>
          <CustomButton onClick={handleClose}>Done</CustomButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

ManagementTable.propTypes = {
  handleClose: PropTypes.func,
  managerList: PropTypes.arrayOf(
    PropTypes.shape({
      manager_first_name: PropTypes.string,
      manager_last_name: PropTypes.string,
      manager_n_number: PropTypes.string
    })
  )
};

export default ManagementTable;