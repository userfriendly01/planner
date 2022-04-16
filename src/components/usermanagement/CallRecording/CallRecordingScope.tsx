import React from "react";
import {
  FormControlsContainer,
  FormControlsPane
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
        {
          groups.map((group: any) => (
            <div key={group.groupId}>{group.name}
              {
                teams.map((team: any) => (team.parentGroupId === group.groupId))
              }
            </div>
          ))
        }
      </FormControlsPane>
    </FormControlsContainer>
  );
};

export default CallRecordingScope;