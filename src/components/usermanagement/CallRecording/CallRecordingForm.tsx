import React, { useEffect } from "react";
import {
  FormControlsContainer,
  FormControlsPane
} from "./CallRecording.Styles";
import CallRecordingScope from "./CallRecordingScope";
import {
  calabrioTimeZones
} from "utils";
import { Dropdown } from "components";
import {
  useAdminState,
  useFormState,
  useFormDispatch,
  userFormActions
} from "context";
import { getCalabrioUser } from "services";

const CallRecordingForm = () => {
  const state = useAdminState();
  const {
    groups,
    teams,
    roles,
    users
  } = state.calabrioContext;

  const form = useFormState();
  const setForm = useFormDispatch();
  console.log("***STATE!", state);
  // console.log("worker", form.nNumberFetchedUser);

  useEffect(() => {
    if(form.calabrioUser.scope.groups.length === 0 || form.calabrioUser.scope.teams.length === 0) {
      if(form.nNumberFetchedUser && form.formMode ==="UPDATE") {
        setScopeOnExistingUser();
      } else {
        setScopeOnNewUser();
      }
    }
  });

  const setScopeOnNewUser = () => {
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
        scope: {
          groups: userGroups,
          teams: userTeams
        }
      }
    });
  };

  const setScopeOnExistingUser = () => {
    const email = form.nNumberFetchedUser.email.toLowerCase();
    const userRecord = users.find(user => user.email.toLowerCase() === email);

    if(userRecord){
      getCalabrioUser(userRecord.personId).then((res: any) => {
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
            userTeams.push({
              ...team,
              checked: true
            });
          } else {
            userTeams.push({
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
              teams: userTeams
            }
          }
        });

      }).catch(err => {
        console.error("Failed to fetch Calabrio User.", err);
      });
    } else {
      console.warn("No user was found in Calabrio with this email");
    }
  };

  const getRoleOptions = () => {
    return roles.map((role: any) => {
      return {
        label: role.name,
        value: role.id
      };
    });
  };
  const getTeamOptions = () => {
    const managerTeams = form.manager.value && form.manager.value.calabrio_team_ids ? form.manager.value.calabrio_team_ids: [];
    const availableTeams = teams.filter(team => managerTeams.includes(team.groupId));
    if(availableTeams.length > 0){
      return availableTeams.map(team => {
        return {
          label: team.name,
          value: team.groupId
        };
      });
    } else {
      return teams.map(team => {
        return {
          label: team.name,
          value: team.groupId
        };
      });
    }
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
          styles={{ width: "300px" }}
        />
        <Dropdown
          label="Team"
          options={getTeamOptions()}
          value={form.calabrioUser.team}
          updateValue={(event: any, team: any) => setForm({
            type: userFormActions.SET_CALABRIO_TEAM,
            payload: team
          })}
          styles={{ width: "300px" }}
        />
        <Dropdown
          label="Time Zone"
          options={calabrioTimeZones}
          value={form.calabrioUser.timezone}
          updateValue={(event: any, timezone: any) => setForm({
            type: userFormActions.SET_CALABRIO_TIMEZONE,
            payload: timezone
          })}
          styles={{ width: "300px" }}
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