import React from "react";
import {
  FormControlsContainer,
  FormControlsPane,
  ScopeContainer,
  ScopeGroupRow,
  ScopeTeamRow
} from "./CallRecording.Styles";
import {
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";

const CallRecordingScope = (props:any) => {

  const {
    groups,
    teams
  } = props;

  const form = useFormState();
  const setForm = useFormDispatch();
  /*
  Scope Component Rules:
    When Tenant is clicked: all groups and teams are selected
    When Group is clicked: all teams within group are selected
    When Group is selected and individual team within that group is de-selected, entire group is de-selected
    When individual team is selected: nothing else is selected
  */

  return(
    <FormControlsContainer>
      <FormControlsPane>
        <ScopeContainer>
          {
            groups.map((group: any) => {
              <ScopeGroupRow key={group.groupId}>{group.name}</ScopeGroupRow>;
              {
                teams.map((team: any) => {
                  if(team.parentGroupId === group.groupId){
                    return <ScopeTeamRow key={team.groupId}>{team.name}</ScopeTeamRow>;
                  }
                });
              }
            })
          }
        </ScopeContainer>
      </FormControlsPane>
    </FormControlsContainer>
  );
};

export default CallRecordingScope;