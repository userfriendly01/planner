import React from "react";
import {
  FormControlsContainer,
  FormControlsPane
} from "./CallRecording.Styles";
import CallRecordingScope from "./CallRecordingScope";
import { FilterableSelect } from "components";
import {
  useAdminState,
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";

const CallRecordingForm = () => {
  const state = useAdminState();
  const groups = state.calabrioContext.groups;
  const teams = state.calabrioContext.teams;
  const roles = [
    "Administrator",
    "Supervisor",
    "Agent",
    "Agent-Sync"
  ];
  const form = useFormState();
  const setForm = useFormDispatch();
  console.log("***STATE!", state);
  console.log("ENV", process.env.APP_ENV);

  const getRoleOptions = () => {
    return roles.map(role => {
      return {
        label: role,
        value: role
      };
    });
  };
  const getTeamOptions = () => {
    return teams.map(team => {
      return {
        label: team.name,
        value: team.groupId
      };
    });
  };

  return(
    <FormControlsContainer>
      <FormControlsPane>
        <div>Roles: </div>
        <FilterableSelect
          optionsList={getRoleOptions()}
        />
        <div>Team</div>
        <FilterableSelect
          optionsList={getTeamOptions()}
        />
      </FormControlsPane>
      <CallRecordingScope
        groups={groups}
        teams={teams}
      />
    </FormControlsContainer>
  );
};

export default CallRecordingForm;