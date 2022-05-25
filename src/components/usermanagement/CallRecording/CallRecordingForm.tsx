import React, { useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Switch
} from "@material-ui/core";
import {
  FormControlsContainer,
  FormControlsPane,
  ToggleContainer,
  ToggleLabel
} from "./CallRecording.Styles";
import CallRecordingScope from "./CallRecordingScope";
import {
  FilterableSelect,
  MultiSelect
} from "components";
import {
  useAdminState,
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";
import { getCalabrioUser } from "services";

const CallRecordingForm = (props: any) => {
  const {
    worker
  } = props;
  const state = useAdminState();
  const tenant = state.calabrioContext.tenant;
  const groups = state.calabrioContext.groups;
  const teams = state.calabrioContext.teams;
  const roles = state.calabrioContext.roles;
  const users = state.calabrioContext.users;

  const form = useFormState();
  const setForm = useFormDispatch();
  console.log("***STATE!", state);
  console.log("worker", worker);

  useEffect(() => {
    if(worker && form.formMode ==="UPDATE") {
      const email = form.nNumberFetchedUser.email.toLowerCase();
      const userRecord = users.filter(user => user.email.toLowerCase() === email);
      //update to put all groups on worker but check the ones that the existing worker has
      if(userRecord){
        getCalabrioUser(tenant.groupId).then((res: any) => {
          console.log("Fetched Calabrio User", res);
          setForm({
            type: userFormActions.SET_CALABRIO_USER,
            payload: {
              isScreenRecorded: res.adLogin ? true : false,
              team: res.groupId,
              roles: res.roles,
              scope: {
                groups: res.scope.groups,
                teams: res.scope.teams,
                tenant: res.scope.tenant
              }
            }
          });
        }).catch(err => {
          console.error("Failed to fetch Calabrio Roles.", err);
        });
      }
    } else {
      console.log("useEffect for new user entered", groups);
      const userGroups: any[] = [];
      const userTeams: any[] = [];

      groups.forEach(group => userGroups.push({
        ...group,
        checked: false,
        partial: false
      }));

      teams.forEach(team => userTeams.push({
        ...team,
        checked: false
      }));
      setForm({
        type: userFormActions.SET_CALABRIO_USER,
        payload: {
          ...form.calabrioUser,
          isScreenRecorded: true,
          scope: {
            groups: userGroups,
            teams: userTeams,
            tenant
          }
        }
      });
    }
  },[]);


  const getRoleOptions = () => {
    return roles.map(role => {
      return {
        label: role.name,
        value: role.id
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
        <MultiSelect
          multiple={true}
          options={getRoleOptions()}
          label={"Roles"}
          updateValue={selectedRoles => {
            console.log("Selected Roles", selectedRoles);
            setForm({
              type: userFormActions.SET_CALABRIO_ROLES,
              payload: roles.filter(role => selectedRoles.some((roleId:any) => roleId === role.id))
            }); }}
          value={form.calabrioUser.roles.map((role: any) => { return role.id; })}
        />
        <MultiSelect
          label={"Team"}
          options={getTeamOptions()}
          updateValue={teamId => setForm({
            type: userFormActions.SET_CALABRIO_TEAM,
            payload: teams.find(team => team.groupId === teamId)
          })}
          value={form.calabrioUser.team ? form.calabrioUser.team.groupId : ""}
        />
        <ToggleContainer>
          <Switch
            // disabled={form.formMode === formModes.UPDATE && worker.directDialNum ? true : false}
            checked={form.calabrioUser.isScreenRecorded}
            onChange={e =>
              setForm({
                type: userFormActions.SET_CALABRIO_SCREEN_RECORDING,
                payload: e.target.checked
              })
            }
            inputProps={{ "aria-label": "toggle-did-user" }}
          />
          <ToggleLabel>Screen Recording</ToggleLabel>
        </ToggleContainer>
      </FormControlsPane>
      <CallRecordingScope
        groups={form.calabrioUser.scope.groups}
        teams={form.calabrioUser.scope.teams}
      />
    </FormControlsContainer>
  );
};

export default CallRecordingForm;