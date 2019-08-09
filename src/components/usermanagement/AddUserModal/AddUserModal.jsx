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
import PropTypes from "prop-types";
import React, {
  useContext,
  // useEffect,
  useState
} from "react";
import styled from "styled-components";

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
    margin: 1%;
  }
`;

const TextInput = styled(TextField)`
  && {
    margin: 1%;
  }
`;

const ManagementTable = props => {

  const {
    handleClose,
    managerList
  } = props;

  const { profiles } = useContext(ProfilesContext);
  const [selectedManager, setSelectedManager] = useState("");
  const [nNumber, setNNumber] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

  const saveUser = () => {
    setSelectedManager("");
    setSelectedTeam("");
  };

  return (
    <ModalContainer>
      <PaperContainer>
        <Header>Add a User</Header>
        <FormField variant="outlined">
          <InputLabel htmlFor="outlined-selectedManager-native-simple">Manager</InputLabel>
          <Select
            native
            value={selectedManager}
            onChange={event => setSelectedManager(event.target.value)}
            input={
              <OutlinedInput name="selectedManager" labelWidth={65} id="outlined-selectedManager-native-simple" />
            }
          >
            <option value="" />
            {managerList.map(manager => (
              <option
                key={manager.manager_n_number}
                value={manager.manager_n_number}
              >
                {manager.manager_first_name} {manager.manager_last_name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField variant="outlined">
          <InputLabel htmlFor="outlined-selectedTeam-native-simple">Team</InputLabel>
          <Select
            native
            value={selectedTeam}
            onChange={event => setSelectedTeam(event.target.value)}
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
          id="outlined-nNumber-input"
          label="N Number"
          name="N Number"
          onChange={event => setNNumber(event.target.value)}
          margin="normal"
          variant="outlined"
          value={nNumber}
        />
        <ButtonWrapper>
          <CustomButton onClick={saveUser}>Save</CustomButton>
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