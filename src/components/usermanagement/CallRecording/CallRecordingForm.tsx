import React, { useEffect } from "react";
import {
  FormControlsContainer,
  FormControlsPane
} from "./CallRecording.Styles";
import CallRecordingScope from "./CallRecordingScope";
import { Dropdown } from "components";
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
      const userRecord = users.find(user => user.email.toLowerCase() === email);
      //update to put all groups on worker but check the ones that the existing worker has
      if(userRecord){
        getCalabrioUser(userRecord.personId).then((res: any) => {
          console.log("Fetched Calabrio User", res);
          const userGroups: any[] = [];
          const userTeams: any[] = [];

          groups.forEach(group => {
            if(res.scope.groups.some((groupId: number) => group.groupId === groupId)){
              userGroups.push({
                ...group,
                checked: true,
                partial: false
              });
            } else {
              userGroups.push({
                ...group,
                checked: false,
                partial: false
              });
            }
          });

          teams.forEach(team => {
            if(res.scope.teams.some((teamId: number) => team.groupId === teamId)){
              userGroups.push({
                ...team,
                checked: true
              });
            } else {
              userGroups.push({
                ...team,
                checked: false
              });
            }
          });
          setForm({
            type: userFormActions.SET_CALABRIO_USER,
            payload: {
              team: res.groupId,
              roles: res.roles,
              scope: {
                groups: userGroups,
                teams: userTeams,
                tenant: res.scope.tenant
              }
            }
          });
        }).catch(err => {
          console.error("Failed to fetch Calabrio User.", err);
        });
      } else {
        console.log("No user was found in Calabrio with this email");
      }
    } else {
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
  return (
    <FormControlsContainer>
      <FormControlsPane>
        <Dropdown
          label="Roles"
          multiple={true}
          options={getRoleOptions()}
          value={form.calabrioUser.roles}
          updateValue={(event: any, selectedRoles: any) => setForm({
            type: userFormActions.SET_CALABRIO_ROLES,
            payload: selectedRoles
          })}
        />
        <Dropdown
          label="Team"
          options={getTeamOptions()}
          value={form.calabrioUser.team}
          updateValue={(event: any, team: any) => setForm({
            type: userFormActions.SET_CALABRIO_TEAM,
            payload: team
          })}
        />
      </FormControlsPane>
      <CallRecordingScope
        groups={form.calabrioUser.scope.groups}
        teams={form.calabrioUser.scope.teams}
      />
    </FormControlsContainer>
  );
};

export default CallRecordingForm;