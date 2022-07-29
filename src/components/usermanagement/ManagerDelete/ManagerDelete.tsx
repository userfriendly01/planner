import {
  ButtonWrapper,
  Header,
  HeaderAndCloseButtonWrapper,
  LeftDiv,
  ModalContainer,
  TextBox,
  PenaltyBox
} from "./ManagerDelete.Styles";
import { CloseRounded } from "@material-ui/icons";
import {
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
  deleteManager
} from "services";

const loadingStates = {
  success: "success",
  fail: "fail",
  loading: "loading"
};
export interface ManagerDeleteProps {
  handleClose: () => void,
  selectedManager: any
}

const ManagerDelete = (props: ManagerDeleteProps): any => {
  const {
    handleClose,
    selectedManager
  } = props;

  const state = useAdminState();
  const profiles = state.profileContext.profiles;
  const [manager] = useState<Manager>(selectedManager ? selectedManager : null);
  const [errorMessage, setErrorMessage] = useState<string>(null);
  const [saveStatus, setSaveStatus] = useState<string>(null);
  const [ profile ] = useState<any>(selectedManager ? profiles.find(p => p.profile_id === selectedManager.profile_id) : null);
  const [ selectedCalabrioTeams ] = useState<number[]>(selectedManager ? selectedManager.calabrio_team_ids :[]);
  const workers = useAdminState().workerContext.workers;
  const dispatch = useAdminDispatch();

  const teamMembers = workers.filter(worker => worker.attributes.manager_n_number === manager.manager_n_number);
  const memberNames = teamMembers.map(worker => `${worker.attributes.emp_first_name} ${worker.attributes.emp_last_name}`);
  const theTeam = memberNames.join(", ");

  const deleteManagerClicked = (): Promise<any> => {
    setSaveStatus(loadingStates.loading);

    return deleteManager(manager.manager_id)
      .then((res: any) => {
        // Remove the deleted manager from our state
        const idx = state.managerContext.managers.findIndex(mgr => mgr.manager_n_number === manager.manager_n_number);
        const lowerHalf = state.managerContext.managers.slice(0, idx);
        const upperHalf = state.managerContext.managers.slice(idx + 1);
        const updatedArray = [...lowerHalf, ...upperHalf];

        dispatch(({
          type: "editManager",
          payload: updatedArray
        }));
        setSaveStatus(loadingStates.success);
        setTimeout(handleClose, 2000);
        console.log("deleteManager() successful", res);
      })
      .catch((err: any) => {
        setSaveStatus(loadingStates.fail);
        setTimeout(() => setSaveStatus(null), 2000);
        setErrorMessage("Failed to delete Manager");
        console.error("deleteManager() failed:", err);
      });
  };

  let overlayMessage = "Deleting...";
  if (saveStatus === loadingStates.success) {
    overlayMessage = "Manager deleted successfully";
  } else if (saveStatus === loadingStates.fail) {
    overlayMessage = errorMessage;
  }

  const confirmationForm = () => {
    return (
      <div>
        <FlexColumn>
          <TextBox>
            Are you sure you want to delete this manager?
          </TextBox>
        </FlexColumn>
        <ButtonWrapper>
          <StyledButton
            disabled={!manager || !profile || selectedCalabrioTeams.length === 0}
            onClick={deleteManagerClicked}
            data-testid={"delete-manager-button"}
          >
            Delete
          </StyledButton>
        </ButtonWrapper>
      </div>
    );
  };

  const errorForm = () => {
    return (
      <div>
        <FlexColumn>
          <TextBox>
            Sorry, this manager cannot be deleted until these team members are re-assigned:
          </TextBox>
          <PenaltyBox>
            {theTeam}
          </PenaltyBox>
        </FlexColumn>
        <ButtonWrapper>
          <StyledButton
            disabled={!manager || !profile || selectedCalabrioTeams.length === 0}
            onClick={handleClose}
            data-testid={"delete-manager-button"}
          >
            Close
          </StyledButton>
        </ButtonWrapper>
      </div>
    );
  };

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
          <Header>Delete Manager {manager.manager_first_name} {manager.manager_last_name}</Header>
          <CloseRounded data-testid={"close-button"} onClick={handleClose}/>
        </HeaderAndCloseButtonWrapper>
        { teamMembers.length ? errorForm() :  confirmationForm() }
      </PaperContainer>
    </ModalContainer>
  );
};

export default ManagerDelete;
