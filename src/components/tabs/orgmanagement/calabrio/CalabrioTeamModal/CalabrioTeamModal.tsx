import {
  ButtonWrapper,
  CloseButton,
  HeaderAndCloseButtonWrapper,
  ModalContainer
} from "./CalabrioTeamModal.Styles";
import { TextField } from "@mui/material";
import { Dropdown } from "components/Dropdown";
import { PaperContainer } from "components/PaperContainer";
import { StyledButton } from "components/StyledButton";
import { ModalOverlay } from "components/ModalOverlay";
import {
  useAdminDispatch,
  useAdminState
} from "context/appContext";
import {
  FlexColumn,
  ModalOverlayStatuses,
  UMManager
} from "globals/interfaces";
import { timeouts } from "globals";
import React, {
  useState
} from "react";
import { createCalabrioTeam } from "services/calabrio";
import { logger } from "utils/logger";
import { getCalabrioTeamName } from "utils/calabrioUtils";
import { Header5 } from "usermanagement/ManagerModal.Styles";

interface TeamModalProps {
  handleClose: (res: any) => void,
  selectedManager: Partial<UMManager>,
  displayNewTeamMessage: boolean,
}

export const CalabrioTeamModal = (props: TeamModalProps) => {
  const state = useAdminState();
  const dispatch = useAdminDispatch();
  const { nNumber } = state.userContext;
  const calabrioTeamName = !props.selectedManager.is_calabrio_team_exception
    ? getCalabrioTeamName(props.selectedManager)
    : "";
  const displayNewTeamMessage = props.displayNewTeamMessage;

  const {
    groups,
    teams
  } = state.calabrioContext;
  const { handleClose } = props;

  const initialNewTeamState: any = {
    name: calabrioTeamName,
    parentGroupId: null
  };
  const [ newTeam, setNewTeam ] = useState(initialNewTeamState);
  const [errorMessage, setErrorMessage] = useState<string>(null);
  const [saveStatus, setSaveStatus] = useState<ModalOverlayStatuses>(null);

  const handleOnSubmit = () => {
    const teamExists = teams.find(t => t.name.toLowerCase() === newTeam.name.toLowerCase());
    if(teamExists){
      setSaveStatus(ModalOverlayStatuses.FAIL);
      setErrorMessage("Team Already Exists");
    } else {
      setSaveStatus(ModalOverlayStatuses.SAVING);
      createCalabrioTeam(state.userContext.tokens.calabrioService, {
        name: newTeam.name,
        parentGroupId: newTeam.parentGroupId.groupId
      }).then((res: any) => {
        dispatch({
          type: "addCalabrioTeam",
          payload: res.data
        });
        setSaveStatus(ModalOverlayStatuses.SUCCESS);
        setTimeout(() => handleClose(res.data), timeouts.MODAL_OVERLAY);

        logger.info("Successfully added Calabrio Team", {
          name: newTeam.name,
          parentGroupId: newTeam.parentGroupId.groupId,
          nNumber
        });
      }).catch(error => {
        const msg = "Unable to Add Calabrio Team";

        logger.error(msg, {
          error,
          nNumber
        });

        setSaveStatus(ModalOverlayStatuses.FAIL);
        setErrorMessage(msg);
      });
    }
  };

  let overlayMessage = "Saving";
  if (saveStatus === ModalOverlayStatuses.SUCCESS) {
    overlayMessage = "New Calabrio Team saved successfully";
  } else if (saveStatus === ModalOverlayStatuses.FAIL) {
    overlayMessage = errorMessage;
  }

  return (
    <ModalContainer>
      <PaperContainer>
        {saveStatus ?
          <ModalOverlay
            handleClose={() => setSaveStatus(null)}
            message={overlayMessage}
            status={saveStatus}
          /> : null}
        <HeaderAndCloseButtonWrapper>
          <h1>Add a Calabrio Team</h1>
          <CloseButton onClick={handleClose}/>
        </HeaderAndCloseButtonWrapper>
        {displayNewTeamMessage && (
          <Header5>No Calabrio Team found for {props.selectedManager.manager_first_name} {props.selectedManager.manager_last_name}
            <br/>
            Please create one now or cancel to select existing teams.
            <br/>
            <br/>
          </ Header5>)}
        <FlexColumn>
          <TextField
            disabled={!props.selectedManager.is_calabrio_team_exception}
            label={"New Team Name"}
            value={newTeam.name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setNewTeam({
                ...newTeam,
                name: event.target.value
              })
            }
          />
          <Dropdown
            label={"Parent Group ID"}
            styles={{
              width: "400px",
              margin: "10px 0px"
            }}
            options={groups.sort().map((group: any) => ({
              label: group.name,
              value: group.groupId,
              ...group
            }))}
            value={newTeam.parentGroupId || ""}
            updateValue={(event: any, newValue: any) =>
              setNewTeam({
                ...newTeam,
                parentGroupId: newValue
              })}
          />
        </FlexColumn>
        <ButtonWrapper>
          <StyledButton
            disabled={!newTeam.name || !newTeam.parentGroupId}
            onClick={handleOnSubmit}>
            Add Team
          </StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};
