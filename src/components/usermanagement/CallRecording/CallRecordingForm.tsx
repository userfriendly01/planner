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
  userFormActions,
  useFormState,
  useFormDispatch
} from "context";
import {
  Discrepancy,
  discrepancyType,
  formModes
} from "globals";
import { getCalabrioUser } from "services";

interface CallRecordingFormInterface {
  twilioWorker: any
}

const CallRecordingForm = (props: CallRecordingFormInterface) => {
  const state = useAdminState();
  const { twilioWorker } = props;
  const {
    groups,
    teams,
    roles,
    users
  } = state.calabrioContext;

  const form = useFormState();
  const setForm = useFormDispatch();
  console.log("***STATE!", state);
  console.log("***Twilio Worker", twilioWorker);

  useEffect(() => {
    if(form.calabrioUser.scope.groups.length === 0 || form.calabrioUser.scope.teams.length === 0) {
      console.warn("groups and teams are empty");
      setScopeOnNewUser();
    }

  }, []);

  useEffect(() => {
    if(form.nNumberFetchedUser && form.formMode === formModes.UPDATE) {
      console.warn("form.nNumberFetchedUser - update and fetched user");
      setScopeOnExistingUser();
    }
  }, [form.nNumberFetchedUser]);

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
    const email = form.nNumberFetchedUser.email?.toLowerCase();
    const acdId = twilioWorker.sid?.toLowerCase();
    let updated = false;
    const userRecord = users.find(user => user.acdId?.toLowerCase() === acdId) || users.find(user => user.email?.toLowerCase() === email);
    console.log("userRecord", userRecord);

    if(userRecord){
      if(userRecord.adLogin?.toLowerCase() !== `lm\\${form.nNumber.value.toLowerCase()}`){
        console.warn("Windows Login does not match calabrio record");
        const discrepancy: Discrepancy = {
          type: discrepancyType.CALABRIO,
          message: "User is not correctly set up for screen recording in Calabrio."
        };
        setForm({
          type: userFormActions.SET_DISCREPANCIES,
          payload: discrepancy
        });
        updated = true;
      }
      if(userRecord.email?.toLowerCase() !== email){
        const discrepancy: Discrepancy = {
          type: discrepancyType.CALABRIO,
          message: "Calabrio Email does not match HR email. This could cause Calabrio Login issues"
        };
        setForm({
          type: userFormActions.SET_DISCREPANCIES,
          payload: discrepancy
        });
        updated = true;
        console.warn("Email does not match calabrio record");
      }
      getCalabrioUser(userRecord.id).then((res: any) => {
        const userGroups: any[] = [];
        const userTeams: any[] = [];
        const fetchedUser = res.data;
        console.warn("Fetched Calabrio User: ", res);

        groups.forEach(group => {
          if(fetchedUser.scope.groups.some((groupId: number) => group.groupId === groupId)){
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
          if(fetchedUser.scope.teams.some((teamId: number) => team.groupId === teamId)){
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
        console.warn("Updated is set to:", updated);
        setForm({
          type: userFormActions.SET_CALABRIO_USER,
          payload: {
            updated,
            id: userRecord.id,
            team: fetchedUser.groupId ? teams.find(team => team.groupId === fetchedUser.groupId) : form.groupId,
            roles: fetchedUser.roles || form.calabrioUser.roles,
            timezone: fetchedUser.timeZone || form.calabrioUser.timezone,
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
      const discrepancy: Discrepancy = {
        type: discrepancyType.CALABRIO,
        message: "No Record found in Calabrio."
      };
      setForm({
        type: userFormActions.SET_DISCREPANCIES,
        payload: discrepancy
      });
      setForm({
        type: userFormActions.SET_CALABRIO_USER,
        payload: {
          ...form.calabrioUser,
          updated: true
        }
      });
    }
  };

  const getRoleOptions = () => {
    return roles.map((role: any) => {
      return {
        ...role,
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
          ...team,
          label: team.name,
          value: team.groupId
        };
      });
    } else {
      return teams.map(team => {
        return {
          ...team,
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
          value={form.calabrioUser.team ?{
            ...form.calabrioUser.team,
            label: form.calabrioUser.team.name,
            value: form.calabrioUser.team.groupId
          }: ""}
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
        calabrioUser={form.calabrioUser}
        setForm={setForm}
      />
    </FormControlsContainer>
  );
};

export default CallRecordingForm;