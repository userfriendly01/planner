import {
  ButtonWrapper,
  Header,
  HeaderAndCloseButtonWrapper,
  LeftDiv,
  ModalContainer
} from "./ManagerDelete.Styles";
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
export interface ManagerDeleteProps {
  handleClose: () => void,
  selectedManager: any
}

const ManagerDelete = (props: ManagerDeleteProps) => {
  const {
    handleClose,
    selectedManager
  } = props;

  const state = useAdminState();
  const profiles = state.profileContext.profiles;
  const calabrioTeams = state.calabrioContext.teams;
  const [manager, setManager] = useState<Manager>(selectedManager ? selectedManager : null);
  const [errorMessage, setErrorMessage] = useState<string>(null);
  const [saveStatus, setSaveStatus] = useState<string>(null);
  const [nNumber, setNNumber] = useState<string>(selectedManager ? selectedManager.manager_n_number : defaultNNumber);
  const [fetchedUser, setFetchedUser] = useState<FetchUserResponse>(null);
  const [ profile, setProfile ] = useState<any>(selectedManager ? profiles.find(p => p.profile_id === selectedManager.profile_id) : null);
  const [ selectedCalabrioTeams, setSelectedCalabrioTeams ] = useState<number[]>(selectedManager ? selectedManager.calabrio_team_ids :[]);

  // const getCalabrioOption = (teamId: number) => {
  //   const team = calabrioTeams.find(team => team.groupId === teamId);
  //   return team ? {
  //     ...team,
  //     value: team.groupId,
  //     label: team.name
  //   } : teamId;
  // };
  const dispatch = useAdminDispatch();

  // const addManagerClicked = (): Promise<any> => {
  //   setSaveStatus(loadingStates.loading);
  //   if (state.managerContext.managers.some((savedManager: Manager) => savedManager.manager_n_number.toLowerCase() === manager.manager_n_number)) {
  //     setSaveStatus(loadingStates.fail);
  //     setTimeout(() => setSaveStatus(null), 2000);
  //     setErrorMessage("Manager already exists");
  //     console.warn("addManager - Failure - Manager Already exists");
  //     return Promise.resolve("addManager - Failure - Manager Already exists");
  //   }
  //   const profileId = profile ? profile.profile_id : null;

  //   return addManager({
  //     manager_first_nme: manager.manager_first_name.replace("'", "\\'"),
  //     manager_last_nme: manager.manager_last_name.replace("'", "\\'"),
  //     manager_n_num: manager.manager_n_number,
  //     profile_id: profileId,
  //     calabrio_team_ids: JSON.stringify(selectedCalabrioTeams)
  //   })
  //     .then(res => {
  //       dispatch(({
  //         type: "addManager",
  //         payload: {
  //           ...manager,
  //           manager_id: res.insertId,
  //           profile_id: profileId,
  //           calabrio_team_ids: selectedCalabrioTeams
  //         }
  //       }));
  //       setSaveStatus(loadingStates.success);
  //       setTimeout(handleClose, 2000);
  //       console.log("addManager - Success", res);
  //     })
  //     .catch(err => {
  //       setSaveStatus(loadingStates.fail);
  //       setTimeout(() => setSaveStatus(null), 2000);
  //       setErrorMessage("Failed to Create Manager");
  //       console.error("addManager - Failure", err);
  //     });
  // };

  const deleteManagerClicked = (): Promise<any> => {
  //   setSaveStatus(loadingStates.loading);
  //   const profileId = profile ? profile.profile_id : null;
  //   const teams = JSON.stringify(selectedCalabrioTeams);

  //   return editManager(manager.manager_id, {
  //     profile_id: profileId,
  //     calabrio_team_ids: teams
  //   })
  //     .then((res: any) => {
  //       const updatedArray = state.managerContext.managers.map(m => {
  //         if(m.manager_id === manager.manager_id){
  //           return {
  //             ...manager,
  //             profile_id: profileId,
  //             calabrio_team_ids: selectedCalabrioTeams
  //           };
  //         } else {
  //           return m;
  //         }
  //       });
  //       dispatch(({
  //         type: "editManager",
  //         payload: updatedArray
  //       }));
  //       setSaveStatus(loadingStates.success);
  //       setTimeout(handleClose, 2000);
  //       console.log("editManager - Success", res);
  //     })
  //     .catch((err: any) => {
  //       setSaveStatus(loadingStates.fail);
  //       setTimeout(() => setSaveStatus(null), 2000);
  //       setErrorMessage("Failed to update Manager");
  //       console.error("editManager - Failure", err);
  //     });
  return Promise.resolve(123);
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
        {/* {saveStatus ? // When form is busy, I think
          <ModalOverlay
            message={overlayMessage}
            status={saveStatus}
          /> : null} */}
        <HeaderAndCloseButtonWrapper>
          <LeftDiv></LeftDiv>
          <Header>Delete Manager {manager.manager_first_name} {manager.manager_last_name}?</Header>
          <CloseRounded data-testid={"close-button"} onClick={handleClose}/>
        </HeaderAndCloseButtonWrapper>
        <ButtonWrapper>
          <StyledButton
            disabled={!manager || !profile || selectedCalabrioTeams.length === 0}
            onClick={deleteManagerClicked}
            data-testid={"delete-manager-button"}
          >
            Delete This Manager
          </StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

export default ManagerDelete;
