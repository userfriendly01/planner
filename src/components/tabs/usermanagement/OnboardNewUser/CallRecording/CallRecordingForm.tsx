import React from "react";
import { CallRecordingScope } from "./";
import {
  FormControlsContainer,
  FormControlsPane
} from "./CallRecording.Styles";
import { Dropdown } from "components";
import {
  useAdminState,
  userFormActions,
  useFormState,
  useFormDispatch
} from "context";
import {
  Discrepancy,
  Worker,
  discrepancyType,
  formModes
} from "globals";
import { getCalabrioUser } from "services";
import {
  calabrioTimeZones,
  calabrioAllowedRoles,
  findMatchingQmProfiles
} from "utils";

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

  React.useEffect(() => {
    if((form.calabrio_qm.scope.groups.length === 0 || form.calabrio_qm.scope.teams.length === 0) && form.formMode === formModes.INSERT) {
      console.warn("groups and teams are empty");
      setScopeOnNewUser();
    }

  }, [form]);

  React.useEffect(() => {
    if(form.nNumber.nNumberFetchedUser && form.formMode === formModes.UPDATE) {
      initiateEditForm();
    }
  }, [form.nNumber.nNumberFetchedUser]);

  // * Workers Comp restricted Roles
  React.useEffect(() => {
    if(parseInt(form.triton.profileId.value) === 18) {
      console.log("Profile 18, setting role to 'No Screen'");
      setWorkersCompRoles();
    }
  }, [form.triton.profileId.value]);

  const initiateEditForm = () => {
    const matchingProfiles = findMatchingQmProfiles(twilioWorker || form.nNumber, users, setForm)
    if(matchingProfiles.length === 0){
      console.warn("No matching profile was found in Calabrio for this user");
      setScopeOnNewUser();
    } else if(matchingProfiles.length === 1){
      setScopeOnExistingUser(matchingProfiles[0]);
    } else {
      console.warn("Multiple matching profiles were found in Calabrio for this user");
      setScopeOnExistingUser(matchingProfiles[0]);
      setForm({
        type: "SET_DISCREPANCIES",
        payload: {
          type: discrepancyType.CALABRIO_QM,
          message: `Multiple (${matchingProfiles.length}) Calabrio Records Found for this user. Requires manual review/correction.`
        }
      });
    }
  };

  const setWorkersCompRoles = () => {
    let selectedRoles:any = [];
    // If existing user and already has Supervisor role, keep it
    if (form.calabrio_qm.roles.find((role: any) => role.name === "Supervisor")) {
      selectedRoles = getRoleOptions();
    } else {
      // for new users, or existing users without a supervisor role, auto populate role to No Screen
      selectedRoles = getRoleOptions().filter(role => role.name === "No Screen");
    }

    setForm({
      type: userFormActions.SET_CALABRIO_ROLES,
      payload: selectedRoles
    });
  };

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
      type: userFormActions.SET_CALABRIO_QM_USER,
      payload: {
        ...form.calabrio_qm,
        scope: {
          groups: userGroups,
          teams: userTeams
        }
      }
    });
  };

  const setScopeOnExistingUser = (userRecord: any) => {
    const email = form.nNumber.nNumberFetchedUser.email?.toLowerCase();
    let updated = false;
    console.log("User Record Found in Calabrio Users", userRecord);

    if(userRecord.adLogin?.toLowerCase() !== `lm\\${form.nNumber.value.toLowerCase()}`){
      console.warn("Windows Login does not match calabrio record");
      const discrepancy: Discrepancy = {
        type: discrepancyType.CALABRIO_QM,
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
        type: discrepancyType.CALABRIO_QM,
        message: "Calabrio Email does not match HR email. This could cause Calabrio Login issues. This will require manual review/correction."
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

      console.warn("FORM", form);
      setForm({
        type: userFormActions.SET_CALABRIO_QM_USER,
        payload: {
          updated,
          acdId: res.data.acdId,
          id: userRecord.id,
          email: userRecord.email,
          team: fetchedUser.groupId && teams.find(team => team.groupId === fetchedUser.groupId),
          roles: fetchedUser.roles || form.calabrio_qm.roles,
          timezone: fetchedUser.timeZone || form.calabrio_qm.timezone,
          scope: {
            groups: userGroups,
            teams: userTeams
          }
        }
      });
    }).catch(err => {
      console.error("Failed to fetch Calabrio User.", err);
    });
  };

  const getRoleOptions = () => {
    let allowed = roles.filter(role => calabrioAllowedRoles.includes(role.name));

    // temporary blocking of roles for Workers Comp Profile 18
    if (parseInt(form.triton.profileId.value) === 18) {
      allowed = allowed.filter(role => role.name === "No Screen" || role.name === "Supervisor");
    }

    return allowed.map(role => {
      return {
        ...role,
        label: role.name,
        value: role.id
      };
    });
  };

  const getTeamOptions = () => {
    // Gather up the parents of all the teams in the manager's scope
    let parentTeams: number[] = [];
    if (form.triton.manager.value && form.triton.manager.value.calabrio_team_ids) {
      parentTeams = form.triton.manager.value.calabrio_team_ids.map(
        (teamId: number) => {
          const targetTeam = state.calabrioContext.teams.find((team: any) => team.groupId === teamId);
          return targetTeam.parentGroupId; // Array may have some duplicates, but that doesn't hurt anything
        }
      );
    }
    // Include any teams that have any of the same parents
    const availableTeams = teams.filter(team => parentTeams.includes(team.parentGroupId));
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
          disabled={form.formMode === formModes.DELETE}
          label="Roles"
          multiple={true}
          options={getRoleOptions()}
          value={form.calabrio_qm.roles}
          updateValue={(event: any, selectedRoles: any) => setForm({
            type: userFormActions.SET_CALABRIO_ROLES,
            payload: selectedRoles
          })}
          styles={{ width: "300px" }}
        />
        <Dropdown
          disabled={form.formMode === formModes.DELETE}
          label="Team"
          options={getTeamOptions()}
          value={form.calabrio_qm.team ? {
            ...form.calabrio_qm.team,
            label: form.calabrio_qm.team.name,
            value: form.calabrio_qm.team.groupId
          }: ""}
          updateValue={(event: any, team: any) => setForm({
            type: userFormActions.SET_CALABRIO_TEAM,
            payload: team
          })}
          styles={{ width: "300px" }}
        />
        <Dropdown
          disabled={form.formMode === formModes.DELETE}
          label="Time Zone"
          options={calabrioTimeZones}
          value={form.calabrio_qm.timezone}
          updateValue={(event: any, timezone: any) => setForm({
            type: userFormActions.SET_CALABRIO_TIMEZONE,
            payload: timezone
          })}
          styles={{ width: "300px" }}
        />
      </FormControlsPane>
      <CallRecordingScope
        calabrioUser={form.calabrio_qm}
        setForm={setForm}
      />
    </FormControlsContainer>
  );
};

export default CallRecordingForm;