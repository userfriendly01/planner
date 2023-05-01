import {
  calabrioGroupLevels,
  CalabrioGroup
} from "../components/tabs/usermanagement/OnboardNewUser/CallRecording/CallRecording.Interfaces";
import {
  getCalabrioUser,
  updateCalabrioUser,
  getWfmOptions as getWfmOptionsServiceCall,
  getWfmOrg as getWfmOrgServiceCall
} from "services";
import util from "util";
import zlib from "zlib";
import {
  AppState,
  CalabrioQmUser,
  WfmBusinessUnit,
  WfmTeam,
  WfmUser
} from "globals";

const inflate = util.promisify(zlib.inflate);

export const calabrioTenants = {
  PROD: "tenant0215",
  NP: "LibertyMutual"
};

export const calabrioAllowedRoles = [
  "Supervisor",
  "Agent-Sync Only",
  "No Screen",
  "QM Agent",
  "WFM_Agent_TT_Dashboards",
  "WFM_Supervisor_TT_Dashboards",
  "WFM_Supervisor_NT_Dashboards",
  "WFM_Agent_NT_Dashboards",
  "Live Monitoring",
  "Recording Access",
  "EXL_Genpact",
  "QM Agent_No Live Monitoring"
];

export const getWfmBusinessUnits = (state: AppState) => {
  const wfmOrg = state.calabrioContext.wfmOrg;
  return wfmOrg.map((businessUnit: WfmBusinessUnit) => {
    return {
      Id: businessUnit.Id,
      Name: businessUnit.Name
    }
  });
};

export const getWfmTeams = (state: AppState, businessUnitId?: string) => {
  const wfmTeams: WfmTeam[] = [];
  
  if(businessUnitId){
    const businessUnit = state.calabrioContext.wfmOrg.find((bu: WfmBusinessUnit) => bu.Id === businessUnitId);
    businessUnit.Teams.forEach((team: WfmTeam) => wfmTeams.push(team));
  } else {
    state.calabrioContext.wfmOrg.forEach((businessUnit: WfmBusinessUnit) => {
      businessUnit.Teams.forEach((team: WfmTeam) => wfmTeams.push(team));
    });
  }
  return wfmTeams;
};

export const getWfmPeople = (state: AppState) => {
  const wfmPeople: WfmUser[] = [];
  const wfmTeams: WfmTeam[] = getWfmTeams(state);

  state.calabrioContext.wfmOrg.forEach((businessUnit: WfmBusinessUnit) => {
    businessUnit.People_Without_Team?.forEach((person: WfmUser) => wfmPeople.push(person));
  });

  wfmTeams.forEach((team: WfmTeam) => {
    team.People?.forEach((person: WfmUser) => wfmPeople.push({
      ParentTeam: team.Id,
      ...person
    }));
  });

  return wfmPeople;
};

export const getWfmOptions = (state: AppState, businessUnitId?: string) => {
  let wfmOptions: any = {};
  
  if(businessUnitId){
    const businessUnit = state.calabrioContext.wfmOptions.find((bu: WfmBusinessUnit) => bu.Id === businessUnitId);
    wfmOptions = businessUnit;
  } else {
    state.calabrioContext.wfmOptions.forEach((businessUnit: WfmBusinessUnit, index) => {
      Object.keys(businessUnit).forEach((option: any) => {
        if(typeof option === "object"){
          wfmOptions[index][option] = wfmOptions[option];
        }
      });
    });
  }
  console.log("FAITH - getWfmOptions", getWfmOptions);
  return wfmOptions;
};

//Calabrio doesnt offer an API for this, only PST, MNT, CST, and EST were requested so we hardcoded them here as they are unlikely to change
//They are also the same through environments
//Update April 2023 : added in the MST, HST and  AKST/AKDT timeszones
export const calabrioTimeZones =  [
  {
    label: "America/New_York (EST/EDT)",
    value: "America/New_York"
  },
  {
    label: "America/Los_Angeles (PST/PDT)",
    value: "America/Los_Angeles"
  },
  {
    label: "America/Denver (MST/MDT)",
    value: "America/Denver"
  },
  {
    label: "America/Chicago (CST/CDT)",
    value: "America/Chicago"
  },
  {
    label: "America/Phoenix (MST)",
    value: "America/Pheonix"
  },
  {
    label: "Pacific/Honolulu (HST)",
    value: "Pacific/Honolulu"
  },
  {
    label: "America/Anchorage (AKST/AKDT)",
    value: "America/Anchorage"
  }
];

export const formatCalabrioTeams = (groupsArray: CalabrioGroup[]): CalabrioGroup[] => {
  const teams = groupsArray.filter((group: CalabrioGroup) => group.groupLevel === calabrioGroupLevels.TEAM);
  return teams.map(team => {
    delete team.users;
    return team;
  });
};

export const formatCalabrioGroups = (groupsArray: CalabrioGroup[]): CalabrioGroup[] => {
  const groups = groupsArray.filter((group: CalabrioGroup) => group.groupLevel === calabrioGroupLevels.GROUP);
  return groups.map(group => {
    delete group.users;
    return group;
  });
};

export const formatCalabrioTenant = (groupsArray: CalabrioGroup[]): CalabrioGroup => {
  const group = groupsArray.find((group: CalabrioGroup) => group.groupLevel === calabrioGroupLevels.TENANT);
  return group;
};

export const formatCalabrioRoles = (rolesArray: any[]): any[] => {
  return rolesArray.map((role: any) => {
    delete role.permissions;
    return role;
  });
};

const toLowerCaseString = (variable: any) => {
  return typeof variable === "string" ? variable.toLowerCase() : variable;
};

/*
  https://forge.lmig.com/wiki/display/CICCT/Calabrio+Form
*/
export const checkConflictingUsers = async (user: any, users: CalabrioQmUser[], roles: any[], teams: any[]): Promise<void> => {
  try {
    const {
      acdId
    } = user;

    const firstName = toLowerCaseString(user.firstName);
    const lastName = toLowerCaseString(user.lastName);
    const email = toLowerCaseString(user.email);
    const adLogin = toLowerCaseString(user.adLogin);

    await Promise.all(users.map(async u => {
      if(u.acdId === acdId){
        return;
      }

      const dupUserAdLogin = toLowerCaseString(u.adLogin);
      const dupUserEmail = toLowerCaseString(u.email);
      const dupUserFirstName = toLowerCaseString(u.firstName);
      const dupUserLastName = toLowerCaseString(u.lastName);

      if (dupUserAdLogin === adLogin || dupUserEmail === email) {
        const res: any = await getCalabrioUser(u.id);
        const dupUser = res.data;
        console.warn("Conflicting User Found with Duplicate Email or Windows Login: ", dupUser);

        dupUser.deactivated = Date.now();
        dupUser.adLogin = `xx-${dupUser.id}-${dupUser.adLogin}`;
        dupUser.email = `xx-${dupUser.id}-${dupUser.email}`;
        dupUser.acdId = `xx-${dupUser.acdId}`;

        if(dupUser.roles.length === 0){
          dupUser.roles = roles.filter(role => role.name.toLowerCase().includes("agent-sync"));
        }
        if(!dupUser.team){
          console.warn("do we get in here?", teams.find(team => team.name.toLowerCase().includes("default")));
          dupUser.team = teams.find(team => team.name.toLowerCase().includes("default"))?.groupId;
        }

        await updateCalabrioUser(dupUser.id, dupUser);
        return;
      }

      if (!dupUserEmail && acdId && firstName === dupUserFirstName && lastName === dupUserLastName) {
        const res: any = await getCalabrioUser(u.id);
        const dupUser = res.data;
        console.warn("Conflicting User Found with First and Last Name: ", dupUser);

        dupUser.deactivated = Date.now();
        dupUser.adLogin = `SHELLUSER-${dupUser.id}`;
        dupUser.email = `SHELLUSER-${dupUser.id}@libertymutual.com`;
        dupUser.acdId = `SH-${dupUser.acdId}`;

        if(dupUser.roles.length === 0){
          dupUser.roles = roles.filter(role => role.name.toLowerCase().includes("agent-sync"));
        }
        if(!dupUser.team){
          dupUser.team = teams.find(team => team.name.toLowerCase().includes("default"))?.groupId;
        }
        await updateCalabrioUser(dupUser.id, dupUser);
        return;
      }
    }));
  } catch(err) {
    console.error("Error thrown trying to fetch and validate Conflicting Users", err);
  }
  return;
};

export const getCalabrioWfmOptions = async (dispatch: any) => {
  try {
    const options: any = await getWfmOptionsServiceCall();
    let optionsData: any = [];
    try {
      const buff = Buffer.from(options.data.organization, "base64");
      const data = await inflate(buff);
      optionsData = JSON.parse(data.toString("utf-8"));
    } catch(err) {
      console.error("Failed to parse and save Calabrio Org data", err);
      return false;
    }
    dispatch({
      type: "loadWfmOptions",
      payload: optionsData.businessUnits
    });
    return true;
  } catch (error) {
    console.error("Failed to fetch calabrio wfm options from service");
    return false;
  }
};

export const getCalabrioWfmOrg = async (dispatch: any) => {
  try {
    const org: any = await getWfmOrgServiceCall();
    let orgData: any = [];
    try {
      const buff = Buffer.from(org.data.organization, "base64");
      const data = await inflate(buff);
      orgData = JSON.parse(data.toString("utf-8"));
    } catch(err) {
      console.error("Failed to parse and save Calabrio Org data", err);
      return false;
    }
    dispatch({
      type: "loadWfmOrg",
      payload: orgData.businessUnits
    });
    return true;
  } catch (error) {
    console.error("Failed to fetch calabrio wfm org from service", error);
    return false;
  }
};