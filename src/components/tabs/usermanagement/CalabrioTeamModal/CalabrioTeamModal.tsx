import {
  ButtonWrapper,
  CloseButton,
  HeaderAndCloseButtonWrapper,
  ModalContainer
} from "./CalabrioTeamModal.Styles";
import { TextField } from "@mui/material";
import {
  Dropdown,
  PaperContainer,
  StyledButton,
  ModalOverlay
} from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import {
  FlexColumn,
  ModalOverlayStatuses,
  timeouts
} from "globals";
import React, { useState } from "react";
import { createCalabrioTeam } from "services";

export interface TeamModalProps {
  handleClose: (res: any) => void
}

const CalabrioTeamModal = (props: TeamModalProps) => {
  const state = useAdminState();
  const dispatch = useAdminDispatch();
  const {
    groups,
    teams
  } = state.calabrioContext;
  const { handleClose } = props;

  const initialNewTeamState: any = {
    name: null,
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
      createCalabrioTeam({
        name: newTeam.name,
        parentGroupId: newTeam.parentGroupId.groupId
      }).then((res: any) => {
        dispatch({
          type: "addCalabrioTeam",
          payload: res.data
        });
        setSaveStatus(ModalOverlayStatuses.SUCCESS);
        setTimeout(() => handleClose(res.data), timeouts.MODAL_OVERLAY);
      }).catch(err => {
        const msg = "Unable to Add Calabrio Team";
        console.error(msg, err);
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
        <FlexColumn>
          <TextField
            label={"New Team Name"}
            value={newTeam.name || ""}
            onChange={(event: any) => {
              setNewTeam({
                ...newTeam,
                name: event.target.value
              });
            }}
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

export default CalabrioTeamModal;