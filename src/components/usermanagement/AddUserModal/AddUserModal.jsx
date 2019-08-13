import {
  ButtonBase,
  FormControl,
  InputLabel,
  OutlinedInput,
  Paper,
  Select,
  TextField
} from "@material-ui/core";
import { ProfilesContext } from "context";
import { apiPaths } from "globals";
import PropTypes from "prop-types";
import React, {
  useContext,
  useEffect,
  useState
} from "react";
import styled, {
  keyframes
} from "styled-components";
import {
  myAxios
} from "utils";

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
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
    animation: ${spin} 1.2s linear infinite;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 1%;
`;

const CustomButton = styled(ButtonBase)`
  && {
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

const ModalContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
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
`;

const FormField = styled(FormControl)`
  && {
    margin: 2%;
  }
`;

const TextInput = styled(TextField)`
  flex-grow: 1;
  && {
    margin: 2%;
  }
`;

const ManagementTable = props => {

  const nNumMatcher = /[n,N]\d{7}/g;
  const {
    handleClose,
    managerList
  } = props;
  const { profiles } = useContext(ProfilesContext);
  const [form, setForm] = useState({
    nNumber: "N",
    outgoing: "",
    manager: "",
    team: "",
    ready: false
  });
  const [loading, updateLoading] = useState({
    lookupUser: false,
    saveUser: false
  });
  const [newUser, setNewUser] = useState({
    did: "",
    email: "",
    manager_first_name: "",
    manager_last_name: "",
    manager_n_number: "",
    n_number: "N",
    office_location_name: "",
    office_location_number: "",
    primary_dept_name: "",
    primary_dept_number: "",
    profile_id: ""
  });

  useEffect(() => {
    console.log("User: ", newUser);
    if (newUser.n_number.match(nNumMatcher)) {
      setForm({
        ...form,
        ready: true
      });
    } else {
      setForm({
        ...form,
        ready: false
      });
    }
  }, [newUser]);

  const saveUser = () => {
    updateLoading({
      ...loading,
      saveUser: true
    });
    myAxios
      .post(apiPaths.CREATE_WORKER, {
        attributes: {
          ...newUser
        }
      })
      .then(res => {
        setForm({
          ...form,
          nNumber: "N"
        });
        setNewUser({
          ...newUser,
          email: "",
          n_number: "N",
          office_location_name: "",
          office_location_number: "",
          primary_dept_name: "",
          primary_dept_number: ""
        });
        updateLoading({
          ...loading,
          saveUser: false
        });
        console.log(res);
      });
  };

  const updateForm = field => event => {
    if (field === "nNumber") {
      const nNum = event.target.value;
      setForm({
        ...form,
        nNumber: nNum
      });
      if (nNum.match(nNumMatcher)) {
        updateLoading({
          ...loading,
          lookupUser: true
        });
        myAxios
          .get(apiPaths.EMPLOYEE_LOOKUP(nNum.substring(1)))
          .then(res => {
            updateLoading({
              ...loading,
              lookupUser: false
            });
            setNewUser({
              ...newUser,
              email: res.data[0].person.data.EMail,
              n_number: nNum,
              office_location_name: res.data[0].person.data.OfficeName,
              office_location_number: res.data[0].person.data.OfficeNumber,
              primary_dept_name: res.data[0].person.data.DepartmentName,
              primary_dept_number: res.data[0].person.data.DepartmentNumber
            });
          });
      }
    } else if (field === "manager") {
      setForm({
        ...form,
        manager: event.target.value
      });
      if(event.target.value !== ""){
        const parsedValue = JSON.parse(event.target.value);
        setNewUser({
          ...newUser,
          manager_first_name: parsedValue.manager_first_name,
          manager_last_name: parsedValue.manager_last_name,
          manager_n_number: parsedValue.manager_n_number
        });
      }
    } else if (field === "team") {
      setForm({
        ...form,
        team: event.target.value
      });
      setNewUser({
        ...newUser,
        profile_id: event.target.value
      });
    } else if (field === "did") {
      setForm({
        ...form,
        outgoing: event.target.value
      });
      setNewUser({
        ...newUser,
        did: event.target.value
      });
    }
  };

  return (
    <ModalContainer>
      <PaperContainer>
        {loading.saveUser ? null : null}
        <Header>Add a User</Header>
        <FormField variant="outlined">
          <InputLabel htmlFor="outlined-selectedManager-native-simple">Manager</InputLabel>
          <Select
            native
            value={form.manager}
            onChange={updateForm("manager")}
            input={
              <OutlinedInput name="selectedManager" labelWidth={65} id="outlined-selectedManager-native-simple" />
            }
          >
            <option value="" />
            {
              managerList.map(manager => (
                <option
                  key={manager.manager_n_number}
                  value={JSON.stringify(manager)}
                >
                  {manager.manager_first_name} {manager.manager_last_name}
                </option>
              ))
            }
          </Select>
        </FormField>
        <FormField variant="outlined">
          <InputLabel htmlFor="outlined-selectedTeam-native-simple">Team</InputLabel>
          <Select
            native
            value={form.team}
            onChange={updateForm("team")}
            input={
              <OutlinedInput name="selectedTeam" labelWidth={41} id="outlined-selectedTeam-native-simple" />
            }
          >
            <option value="" />
            {profiles.map(profile => (
              <option key={profile.profile_id} value={profile.profile_id}>{profile.profile_nme}</option>
            ))}
          </Select>
        </FormField>
        <TextInput
          id="outlined-outgoing-input"
          inputProps={{ "maxLength": "10" }}
          label="Outgoing Number"
          name="Outgoing Number"
          onChange={updateForm("did")}
          margin="normal"
          variant="outlined"
          value={form.outgoing}
        />
        <div style={ { "display": "flex" } }>
          <TextInput
            id="outlined-nNumber-input"
            inputProps={{ "maxLength": "8" }}
            label="N Number"
            name="N Number"
            onChange={updateForm("nNumber")}
            margin="normal"
            variant="outlined"
            value={form.nNumber}
          />
          {loading.lookupUser ? <FetchingRing /> : null}
        </div>
        <ButtonWrapper>
          <CustomButton disabled={!form.ready} onClick={saveUser}>Add User</CustomButton>
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