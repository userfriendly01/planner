import {
  ButtonWrapper,
  CloseButton,
  Header,
  HeaderAndCloseButtonWrapper,
  ModalContainer
} from "./CalabrioTeamModal.Styles";

import { TextField } from "@mui/material";
import {
  Dropdown,
  PaperContainer,
  StyledButton
} from "components";
import {
  useAdminDispatch,
  useAdminState
} from "context";
import { FlexColumn } from "globals";
import React, { useState } from "react";
import { createCalabrioTeam } from "services";
export interface TeamModalProps {
  handleClose: (res: any) => void
}

const CalabrioTeamModal = (props: TeamModalProps) => {
  const state = useAdminState();
  const dispatch = useAdminDispatch();
  const { groups } = state.calabrioContext;
  const { handleClose } = props;

  const initialNewTeamState: any = {
    name: null,
    parentGroupId: null
  };
  const [ newTeam, setNewTeam ] = useState(initialNewTeamState);

  const handleOnSubmit = () => {
    createCalabrioTeam({
      name: newTeam.name,
      parentGroupId: newTeam.parentGroupId
    }).then((res: any) => {
      dispatch({
        type: "addCalabrioTeam",
        payload: res.data
      });
      handleClose(res);
    }).catch(err => {
      console.error("Unable to Add Calabrio Team", err);
    });
  };

  return (
    <ModalContainer>
      <PaperContainer>
        <HeaderAndCloseButtonWrapper>
          <h1>Add a Calabrio Team</h1>
          <CloseButton onClick={handleClose}/>
        </HeaderAndCloseButtonWrapper>
        <FlexColumn>
          <TextField
            label={"New Team Name"}
            value={newTeam.name || ""}
            onChange={(event: any) => setNewTeam({
              ...newTeam,
              name: event.target.value
            })}
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
                parentGroupId: newValue.groupId
              })}
          />
        </FlexColumn>
        <ButtonWrapper>
          <StyledButton
            disabled={!newTeam.name || !newTeam.parentGroupId}
            onClick={handleOnSubmit}
            data-testid={"create-calabrio-team-button"}>
            Add Team
          </StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

export default CalabrioTeamModal;