
import { Wrapper } from "./ManagerModal.Styles";
import {
  ButtonWrapper,
  Header,
  HeaderAndCloseButtonWrapper,
  LeftDiv,
  ModalContainer
} from "./ManagerModal.Styles";
import { Modal } from "@material-ui/core";
import { CloseRounded } from "@material-ui/icons";
import {
  Dropdown,
  ModalNNumber,
  ModalOverlay,
  PaperContainer,
  StyledButton,
  CalabrioTeamModal
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
  editManager,
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
  selectedManager: any,
}

interface DropdownOption {
  label: string,
  value: any
}

const ManagerModal = (props: ManagerModalProps) => {
  const {
    handleClose,
    selectedManager
  } = props;

  const state = useAdminState();
  const profiles = state.profileContext.profiles;
  const calabrioTeams = state.calabrioContext.teams;
  const options: DropdownOption[] = [
    {
      label: "Add Calabrio Team",
      value: "add-team"
    },
    {
      label: "divider",
      value: "divider"
    },
    ...calabrioTeams.map((team: any) => ({
      label: team.name,
      value: team.groupId,
      ...team
    }))
  ];
  console.log(calabrioTeams);
  const [manager, setManager] = useState<Manager>(selectedManager ? selectedManager : null);
  const [errorMessage, setErrorMessage] = useState<string>(null);
  const [saveStatus, setSaveStatus] = useState<string>(null);
  const [nNumber, setNNumber] = useState<string>(selectedManager ? selectedManager.manager_n_number : defaultNNumber);
  const [fetchedUser, setFetchedUser] = useState<FetchUserResponse>(null);
  const [ profile, setProfile ] = useState<any>(selectedManager ? profiles.find(p => p.profile_id === selectedManager.profile_id) : null);
  const [ selectedCalabrioTeams, setSelectedCalabrioTeams ] = useState<number[]>(selectedManager ? selectedManager.calabrio_team_ids :[]);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const getCalabrioOption = (teamId: number): any => {
    const team = calabrioTeams.find(team => team.groupId === teamId);
    return team ? {
      ...team,
      value: team.groupId,
      label: team.name
    } : teamId;
  };
  const dispatch = useAdminDispatch();

  const handleOpenTeam = () => {
    setIsTeamModalOpen(true);
  };

  const handleCloseTeam = (res: any) => {
    setIsTeamModalOpen(false);
    /*res = {
      ...res,
      label: res.name,
      value: res.groupId
    };
    setSelectedCalabrioTeams(calabrioTeams.map((team:any) => team.value));*/
  };

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

    return addManager({
      manager_first_nme: manager.manager_first_name.replace("'", "\\'"),
      manager_last_nme: manager.manager_last_name.replace("'", "\\'"),
      manager_n_num: manager.manager_n_number,
      profile_id: profileId,
      calabrio_team_ids: JSON.stringify(selectedCalabrioTeams)
    })
      .then(res => {
        dispatch(({
          type: "addManager",
          payload: {
            ...manager,
            manager_id: res.insertId,
            profile_id: profileId,
            calabrio_team_ids: selectedCalabrioTeams
          }
        }));
        setSaveStatus(loadingStates.success);
        setTimeout(handleClose, 2000);
        console.log("addManager - Success", res);
      })
      .catch(err => {
        setSaveStatus(loadingStates.fail);
        setTimeout(() => setSaveStatus(null), 2000);
        setErrorMessage("Failed to Create Manager");
        console.error("addManager - Failure", err);
      });
  };

  const editManagerClicked = (): Promise<any> => {
    setSaveStatus(loadingStates.loading);
    const profileId = profile ? profile.profile_id : null;
    const teams = JSON.stringify(selectedCalabrioTeams);

    return editManager(manager.manager_id, {
      profile_id: profileId,
      calabrio_team_ids: teams
    })
      .then((res: any) => {
        const updatedArray = state.managerContext.managers.map(m => {
          if(m.manager_id === manager.manager_id){
            return {
              ...manager,
              profile_id: profileId,
              calabrio_team_ids: selectedCalabrioTeams
            };
          } else {
            return m;
          }
        });
        dispatch(({
          type: "editManager",
          payload: updatedArray
        }));
        setSaveStatus(loadingStates.success);
        setTimeout(handleClose, 2000);
        console.log("editManager - Success", res);
      })
      .catch((err: any) => {
        setSaveStatus(loadingStates.fail);
        setTimeout(() => setSaveStatus(null), 2000);
        setErrorMessage("Failed to update Manager");
        console.error("editManager - Failure", err);
      });
  };

  let overlayMessage = "Saving";
  if (saveStatus === loadingStates.success) {
    overlayMessage = "Manager saved successfully";
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
          { selectedManager ?
            <Header>Edit {manager.manager_first_name} {manager.manager_last_name}</Header>
            : <Header>Add a Manager</Header>
          }
          <CloseRounded data-testid={"close-button"} onClick={handleClose}/>
        </HeaderAndCloseButtonWrapper>
        <FlexColumn>
          <ModalNNumber
            disabled={saveStatus || selectedManager ? true : false}
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
          <Wrapper>
            <Dropdown
              multiple={true}
              label={"Calabrio Team Options *"}
              styles={{
                width: "400px",
                margin: "10px 0px"
              }}
              options={options}
              value={selectedCalabrioTeams.map(teamId => getCalabrioOption(teamId))}
              updateValue={(event: any, newInputValue: any) => {
                if(newInputValue.some((t: any) => t.value === "add-team")){
                  handleOpenTeam();
                }
                else{
                  setSelectedCalabrioTeams(newInputValue.map((team:any) => team.value));
                }
              }}
            />
            <Modal disableBackdropClick={true} open={isTeamModalOpen}>
              <CalabrioTeamModal handleClose={handleCloseTeam}/>
            </Modal>
          </Wrapper>
        </FlexColumn>
        <ButtonWrapper>
          { selectedManager ?
            <StyledButton disabled={!manager || !profile || selectedCalabrioTeams.length === 0} onClick={editManagerClicked} data-testid={"edit-manager-button"}>
              Save
            </StyledButton>
            : <StyledButton disabled={!manager || !profile || selectedCalabrioTeams.length === 0} onClick={addManagerClicked} data-testid={"add-manager-button"}>
              Add Manager
            </StyledButton>
          }
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

export default ManagerModal;
