import {
  ButtonWrapper,
  Header,
  HeaderAndCloseButtonWrapper,
  LeftDiv,
  ModalContainer
} from "./ManagerModal.Styles";
import { CloseRounded } from "@material-ui/icons";
import {
  Dropdown,
  ModalNNumber,
  ModalOverlay,
  PaperContainer,
  StyledButton
} from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import {
  FlexColumn,
  Manager
} from "globals";
import React, { useState } from "react";
import {
  addManager,
  FetchUserResponse
} from "services";
import { sortProfilesByName } from "utils";

const defaultNNumber = "n";
const loadingStates = {
  success: "success",
  fail: "fail",
  loading: "loading"
};
export interface ManagerModalProps {
  handleClose: () => void,
  editManager: any
}

const ManagerModal = (props: ManagerModalProps) => {
  const {
    handleClose,
    editManager
  } = props;

  const state = useAdminState();
  const profiles = state.profileContext.profiles;
  const calabrioTeams = state.calabrioContext.teams;
  const [manager, setManager] = useState<Manager>(editManager ? editManager : null);
  const [errorMessage, setErrorMessage] = useState<string>(null);
  const [saveStatus, setSaveStatus] = useState<string>(null);
  const [nNumber, setNNumber] = useState<string>(editManager ? editManager.manager_n_number : defaultNNumber);
  const [fetchedUser, setFetchedUser] = useState<FetchUserResponse>(null);
  const [ profile, setProfile ] = useState<any>(editManager ? profiles.find(p => p.profile_id === editManager.profile_id) : null);
  const [ selectedCalabrioTeams, setSelectedCalabrioTeams ] = useState<any[]>(editManager ? calabrioTeams.filter(team => editManager.calabrio_team_ids.includes(team.groupId)) :[]);

  const dispatch = useAdminDispatch();

  console.log("MANAGER PASSED IN", editManager);

  const addManagerClicked = (): Promise<any> => {
    setSaveStatus(loadingStates.loading);
    if (state.managerContext.managers.some((savedManager: Manager) => savedManager.manager_n_number.toLowerCase() === manager.manager_n_number)) {
      setSaveStatus(loadingStates.fail);
      setTimeout(() => setSaveStatus(null), 2000);
      setErrorMessage("Manager already exists");
      console.warn("addManager - Failure - Manager Already exists");
      return Promise.resolve("addManager - Failure - Manager Already exists");
    }
    const profileId = profile ? profile.profile_id : null;
    const teams = JSON.stringify(selectedCalabrioTeams.map(team => team.groupId));
    return addManager({
      manager_first_nme: manager.manager_first_name.replace("'", "\\'"),
      manager_last_nme: manager.manager_last_name.replace("'", "\\'"),
      manager_n_num: manager.manager_n_number,
      profile_id: profileId,
      calabrio_team_ids: teams
    })
      .then(res => {
        dispatch(({
          type: "addManager",
          payload: {
            ...manager,
            profile_id: profileId,
            calabrio_team_ids: teams
          }
        }));
        setSaveStatus(loadingStates.success);
        setTimeout(handleClose, 2000);
        console.log("addManager - Success", res);
      })
      .catch(err => {
        setSaveStatus(loadingStates.fail);
        setTimeout(() => setSaveStatus(null), 2000);
        setErrorMessage(JSON.stringify(err));
        console.log("addManager - Failure", err);
      });
  };

  const editManagerClicked = (): Promise<any> => {
    setSaveStatus(loadingStates.loading);
    if (state.managerContext.managers.some((savedManager: Manager) => savedManager.manager_n_number.toLowerCase() === manager.manager_n_number)) {
      setSaveStatus(loadingStates.fail);
      setTimeout(() => setSaveStatus(null), 2000);
      setErrorMessage("Manager already exists");
      console.warn("addManager - Failure - Manager Already exists");
      return Promise.resolve("addManager - Failure - Manager Already exists");
    }
    const profileId = profile ? profile.profile_id : null;
    const teams = JSON.stringify(selectedCalabrioTeams.map(team => team.groupId));
    return addManager({
      manager_first_nme: manager.manager_first_name.replace("'", "\\'"),
      manager_last_nme: manager.manager_last_name.replace("'", "\\'"),
      manager_n_num: manager.manager_n_number,
      profile_id: profileId,
      calabrio_team_ids: teams
    })
      .then(res => {
        dispatch(({
          type: "addManager",
          payload: {
            ...manager,
            profile_id: profileId,
            calabrio_team_ids: teams
          }
        }));
        setSaveStatus(loadingStates.success);
        setTimeout(handleClose, 2000);
        console.log("addManager - Success", res);
      })
      .catch(err => {
        setSaveStatus(loadingStates.fail);
        setTimeout(() => setSaveStatus(null), 2000);
        setErrorMessage(JSON.stringify(err));
        console.log("addManager - Failure", err);
      });
  };

  let overlayMessage = "Saving";
  if (saveStatus === loadingStates.success) {
    overlayMessage = "Manager added successfully";
  } else if (saveStatus === loadingStates.fail) {
    overlayMessage = errorMessage;
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
          { editManager ?
            <Header>Edit {manager.manager_first_name} {manager.manager_last_name}</Header>
            : <Header>Add a Manager</Header>
          }
          <CloseRounded data-testid={"close-button"} onClick={handleClose}/>
        </HeaderAndCloseButtonWrapper>
        <FlexColumn>
          <ModalNNumber
            disabled={saveStatus || editManager ? true : false}
            fetchedUser={fetchedUser}
            label="N Number"
            onComplete={(fetchedUser, nNumber) => {
              setNNumber(nNumber);
              setManager({
                manager_n_number: nNumber.toLowerCase(),
                manager_first_name: fetchedUser.firstName,
                manager_last_name: fetchedUser.lastName
              });
              setFetchedUser(fetchedUser);
            }}
            onClear={() => {
              setNNumber(defaultNNumber);
              setManager(null);
            }}
            onUpdate={nNumber => {
              setNNumber(nNumber);
            }}
            value={nNumber}
          />
          <Dropdown
            label={"Team *"}
            styles={{
              width: "400px",
              margin: "10px 0px"
            }}
            options={state.profileContext.profiles.sort(sortProfilesByName).map((profile: any) => ({
              label: profile.profile_nme,
              value: profile.profile_id,
              ...profile
            }))}
            value={profile && profile.profile_nme ? profile.profile_nme : ""}
            updateValue={(event: any, newValue: any) => setProfile(newValue)}
          />
          <Dropdown
            multiple={true}
            label={"Calabrio Team Options *"}
            styles={{
              width: "400px",
              margin: "10px 0px"
            }}
            options={state.calabrioContext.teams.map((team: any) => ({
              label: team.name,
              value: team.groupId,
              ...team
            }))}
            value={selectedCalabrioTeams.map(team => team.name)}
            updateValue={(event: any, newValue: any) => setSelectedCalabrioTeams(newValue)}
          />
        </FlexColumn>
        <ButtonWrapper>
          <StyledButton disabled={!manager || !profile || calabrioTeams.length < 0} onClick={addManagerClicked} data-testid={"add-manager-button"}>
            Add Manager
          </StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

export default ManagerModal;
