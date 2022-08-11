import {
  ButtonWrapper,
  Header,
  HeaderAndCloseButtonWrapper,
  LeftDiv,
  ModalContainer
} from "./CalabrioTeamModal.Styles";
import {
  CloseRounded
} from "@material-ui/icons";
import { TextField } from "@mui/material";
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
  createCalabrioTeam,
  FetchUserResponse
} from "services";
import { sortProfilesByName } from "utils";

const defaultNNumber = "n";
const loadingStates = {
  success: "success",
  fail: "fail",
  loading: "loading"
};

interface DropdownOption {
  label: string,
  value: any
}

export interface TeamModalProps {
  handleClose: (res: any) => void
}

const CalabrioTeamModal = (props: TeamModalProps) => {
  const state = useAdminState();
  const dispatch = useAdminDispatch();
  const {
    groups,
    teams,
    roles,
    users
  } = state.calabrioContext;
  const { handleClose } = props;

  const [newName, setNewName] = useState<string>();
  const [parentGroupId, setParentGroupId] = useState<number>();
  const [group, setGroup] = useState<any>();

  return (
    <ModalContainer>
      <PaperContainer>
        <HeaderAndCloseButtonWrapper>
          <LeftDiv></LeftDiv>
          <Header>Add a Calabrio Team</Header>
          <CloseRounded data-testid={"close-button"} onClick={handleClose}/>
        </HeaderAndCloseButtonWrapper>
        <FlexColumn>
          <TextField
            label={"New Team Name"}
            value={newName}
            onChange={(event: any) => {
              setNewName(event.target.value);
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
            value={group && group.name ? group.name : ""}
            updateValue={(event: any, newValue: any) =>
            { setParentGroupId(newValue.groupId);
              setGroup(newValue); }
            }
          />
        </FlexColumn>
        <ButtonWrapper>
          <StyledButton
            disabled={!newName || !parentGroupId}
            onClick={() => {
              createCalabrioTeam({
                name: newName,
                parentGroupId: parentGroupId
              }).then((res: any) => {
                handleClose(res);
                console.log(res.data);
                dispatch({
                  type: "addCalabrioTeam",
                  payload: res.data
                });
              });
            }}
            data-testid={"edit-manager-button"}>
            Add Team
          </StyledButton>
        </ButtonWrapper>
      </PaperContainer>
    </ModalContainer>
  );
};

export default CalabrioTeamModal;