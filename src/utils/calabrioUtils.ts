import {
  calabrioGroupLevels,
  CalabrioGroup,
  CalabrioUser
} from "usermanagement/CallRecording.Interfaces";
import {
  getCalabrioUser,
  updateCalabrioUser,
  getWfmOptions as getWfmOptionsServiceCall,
  getWfmOrg as getWfmOrgServiceCall,
  getCalabrioUsers
} from "services/calabrio";
import util from "util";
import zlib from "zlib";
import {
  AppState,
  CalabrioQmUser,
  WfmBusinessUnit,
  WfmTeam,
  WfmUser,
  discrepancyType,
  Action,
  Tokens
} from "globals/interfaces";
import { logger } from "utils/logger";

const inflate = util.promisify(zlib.inflate);

export const calabrioTimeZones = [
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
    value: "America/Phoenix"
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

export const calabrioAllowedRoles = [
  "Supervisor-Sync Only",
  "Agent-Sync Only",
  "No Screen",
  "QM Supervisor",
  "QM Agent",
  "WFM_Agent_TT_Dashboards",
  "WFM_Supervisor_TT_Dashboards",
  "WFM_Supervisor_NT_Dashboards",
  "WFM_Agent_NT_Dashboards",
  "Recording Access",
  "EXL_Genpact",
  "QM Agent_No Live Monitoring"
];

export const daysOfTheWeekOptions = [
  {
    value: 0,
    label: "Sunday"
  },
  {
    value: 1,
    label: "Monday"
  },
  {
    value: 2,
    label: "Tuesday"
  },
  {
    value: 3,
    label: "Wednesday"
  },
  {
    value: 4,
    label: "Thursday"
  },
  {
    value: 5,
    label: "Friday"
  },
  {
    value: 6,
    label: "Saturday"
  }
];

const toLowerCaseString = (variable: any) => {
  return typeof variable === "string" ? variable.toLowerCase() : variable;
};

const decompressResponse = async (body: any) => {
  const buff = Buffer.from(body, "base64");
  const data = await inflate(buff);
  return JSON.parse(data.toString("utf-8"));
};

export const addWorkerToOrg = (user: WfmUser, state: AppState) => {
  const wfmOrg = state.calabrioContext.wfmOrg;
  const businessUnitId = user.BusinessUnitId;
  const team = user.TeamId;

  if (team) {
    return wfmOrg.map((bu: WfmBusinessUnit) => {
      if (bu.Id === businessUnitId) {
        const team: any = bu.Teams?.find(t => t.Id === user.TeamId) || {};
        if (team) {
          const teams = bu.Teams?.filter(t => t.Id !== team.Id) || [];
          const people = team.People || [];
          return {
            ...bu,
            Teams: [
              ...teams,
              {
                ...team,
                People: [
                  ...people,
                  user
                ]
              }
            ]
          };
        }
      } else {
        return bu;
      }
    });
  } else {
    return wfmOrg.map((bu: WfmBusinessUnit) => {
      if (bu.Id === "People_Without_Team") {
        const people = bu.People || [];
        return {
          ...bu,
          People: [
            ...people,
            user
          ]
        };
      } else {
        return bu;
      }
    });
  }
};

export const getWfmBusinessUnits = (state: AppState, includeLostSouls?: boolean) => {
  const wfmOrg = state.calabrioContext.wfmOrg;
  if (includeLostSouls) {
    return wfmOrg.map((businessUnit: WfmBusinessUnit) => {
      return {
        Id: businessUnit.Id,
        Name: businessUnit.Name
      };
    });
  } else {
    const peopleWithHomes = wfmOrg.filter((businessUnit: WfmBusinessUnit) => businessUnit.Id !== "People_Without_Team");
    return peopleWithHomes.map((businessUnit: WfmBusinessUnit) => {
      return {
        Id: businessUnit.Id,
        Name: businessUnit.Name
      };
    });
  }
};

export const getWfmTeams = (state: AppState, businessUnitId?: string, includeLostSouls?: boolean) => {
  const wfmTeams: WfmTeam[] = [];

  const businessUnit = state.calabrioContext.wfmOrg?.find((bu: WfmBusinessUnit) => bu.Id === businessUnitId);
  if (businessUnit) {
    businessUnit.Teams?.forEach((team: WfmTeam) => wfmTeams.push(team));
  } else {
    if (!includeLostSouls) {
      state.calabrioContext.wfmOrg?.forEach((businessUnit: WfmBusinessUnit) => {
        businessUnit.Teams?.forEach((team: WfmTeam) => {
          if (team.Id) {
            wfmTeams.push(team);
          }
        });
      });
    } else {
      state.calabrioContext.wfmOrg?.forEach((businessUnit: WfmBusinessUnit) => {
        businessUnit.Teams?.forEach((team: WfmTeam) => wfmTeams.push(team));
      });
    }
  }
  return wfmTeams;
};

export const getWfmPeople = (state: AppState) => {
  const wfmPeople: WfmUser[] = [];
  const wfmTeams: WfmTeam[] = getWfmTeams(state);

  state.calabrioContext.wfmOrg?.forEach((businessUnit: WfmBusinessUnit) => {
    if (businessUnit.Id === "People_Without_Team") {
      businessUnit?.People?.forEach((person: WfmUser) => wfmPeople.push(person));
    }
  });

  wfmTeams?.forEach((team: WfmTeam) => {
    team.People?.forEach((person: WfmUser) => wfmPeople.push({
      ParentTeam: team.Id,
      ...person
    }));
  });

  return wfmPeople;
};

export const getWfmOptions = (state: AppState, businessUnitId?: string) => {
  const options = JSON.parse(JSON.stringify(state.calabrioContext.wfmOptions));

  if (businessUnitId) {
    const businessUnit = options.find((bu: WfmBusinessUnit) => bu.Id === businessUnitId);
    return businessUnit;
  } else {
    const finalOptions: any = {};

    options?.forEach((businessUnit: any) => {
      Object.keys(businessUnit)?.forEach((option: any) => {
        if (typeof businessUnit[option] === "object") {
          if (finalOptions[option]) {
            businessUnit[option]?.forEach((buo: any) => {
              const optionFound = finalOptions[option].find((o: any) => o.Id === buo.Id);
              if (!optionFound) {
                finalOptions[option].push(buo);
              }
            });
          } else {
            finalOptions[option] = businessUnit[option];
          }
        }
      });
    });
    return finalOptions;
  }
};

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
    return role;
  });
};

/*
  https://forge.lmig.com/wiki/display/CICCT/Calabrio+Form
*/
export const checkConflictingUsers = async (calabrioServiceToken: string, user: any, users: CalabrioQmUser[], roles: any[], teams: any[]): Promise<void> => {
  try {
    const {
      acdId
    } = user;

    const firstName = toLowerCaseString(user.firstName);
    const lastName = toLowerCaseString(user.lastName);
    const email = toLowerCaseString(user.email);
    const adLogin = toLowerCaseString(user.adLogin);

    await Promise.all(users.map(async u => {
      if (u.acdId === acdId) {
        return;
      }

      const dupUserAdLogin = toLowerCaseString(u.adLogin);
      const dupUserEmail = toLowerCaseString(u.email);
      const dupUserFirstName = toLowerCaseString(u.firstName);
      const dupUserLastName = toLowerCaseString(u.lastName);

      if (dupUserAdLogin === adLogin || dupUserEmail === email) {
        const res: any = await getCalabrioUser(calabrioServiceToken, u.id);
        const dupUser = res.data;

        logger.warn("Conflicting User Found with Duplicate Email or Windows Login: ", { dupUser }, false);

        dupUser.deactivated = Date.now();
        dupUser.adLogin = `xx-${dupUser.id}-${dupUser.adLogin}`;
        dupUser.email = `xx-${dupUser.id}-${dupUser.email}`;
        dupUser.acdId = `xx-${dupUser.acdId}`;

        if (dupUser.roles.length === 0) {
          dupUser.roles = roles.filter(role => role.name.toLowerCase().includes("agent-sync"));
        }
        if (!dupUser.team) {
          logger.warn("do we get in here?", { teams: teams.find(team => team.name.toLowerCase().includes("default")) }, false);
          dupUser.team = teams.find(team => team.name.toLowerCase().includes("default"))?.groupId;
        }

        await updateCalabrioUser(calabrioServiceToken, dupUser);
        return;
      }

      if (!dupUserEmail && acdId && firstName === dupUserFirstName && lastName === dupUserLastName) {
        const res: any = await getCalabrioUser(calabrioServiceToken, u.id);
        const dupUser = res.data;

        logger.warn("Conflicting User Found with First and Last Name: ", { dupUser }, false);

        dupUser.deactivated = Date.now();
        dupUser.adLogin = `SHELLUSER-${dupUser.id}`;
        dupUser.email = `SHELLUSER-${dupUser.id}@libertymutual.com`;
        dupUser.acdId = `SH-${dupUser.acdId}`;

        if (dupUser.roles.length === 0) {
          dupUser.roles = roles.filter(role => role.name.toLowerCase().includes("agent-sync"));
        }
        if (!dupUser.team) {
          dupUser.team = teams.find(team => team.name.toLowerCase().includes("default"))?.groupId;
        }
        await updateCalabrioUser(calabrioServiceToken, dupUser);
        return;
      }
    }));
  } catch (error) {
    logger.error("Error thrown trying to fetch and validate Conflicting Users", { error });
  }
  return;
};

export const findMatchingQmProfiles = (user: any, users: CalabrioQmUser[], setForm: any): any[] => {
  //Calabrio users should always have a Triton user, the "user" passed through should be a triton user but if that's undefined we can search based on nNumber fetched user
  try {
    const acdId = toLowerCaseString(user.sid);
    const email = toLowerCaseString(user.attributes?.email || user.nNumberFetchedUser?.email);
    const adLogin = `lm\\${toLowerCaseString(user.attributes?.n_number || user?.value)}`;

    if (!acdId) {
      setForm({
        type: "SET_DISCREPANCIES",
        payload: {
          type: discrepancyType.CALABRIO_QM,
          message: "Triton Worker Record not found but is required for Calabrio QM. This will require manual review/correction."
        }
      });
    }

    const matchingProfiles: any[] = [];
    users.forEach(u => {
      const dupUserAcdId = toLowerCaseString(u.acdId);
      const dupUserAdLogin = toLowerCaseString(u.adLogin);
      const dupUserEmail = toLowerCaseString(u.email);
      if (acdId && acdId === dupUserAcdId) {
        logger.warn("User Found with ACD Id", { user: u }, false);
        matchingProfiles.unshift(u);
      } else if (dupUserAdLogin && dupUserAdLogin === adLogin || dupUserEmail && dupUserEmail === email) {

        logger.warn("User Found with Duplicate Email or Windows Login: ", { user: u }, false);

        if (acdId) {
          setForm({
            type: "SET_DISCREPANCIES",
            payload: {
              type: discrepancyType.CALABRIO_QM,
              message: `Calabrio QM Record found for user where the ACD ID does not match the Triton Worker. This will require manual review/correction. Search Calabrio for a record (active or inactive) where the ACD equals ${acdId}, make that the primary user and deactivate all other users.`
            }
          });
        }
        matchingProfiles.push(u);
      }
    });
    return matchingProfiles;
  } catch (error) {
    logger.error("Error thrown trying to find QM profiles", { error });
    return [];
  }
};

export const getCalabrioWfmOptions = async (dispatch: (action: Action) => void, tokens: Tokens): Promise<boolean> => {
  try {
    const res: any = await getWfmOptionsServiceCall(tokens.calabrioService);
    let optionsData: any = [];
    try {
      if (res.data.compressed) {
        const data = await decompressResponse(res.data.data);
        optionsData = data.organization || [];
      } else {
        optionsData = res.data.organization || [];
      }
    } catch (error) {
      logger.error("Failed to parse and save Calabrio Org data", { error });
      return false;
    }
    dispatch({
      type: "loadWfmOptions",
      payload: optionsData.businessUnits
    });
    return true;
  } catch (error) {
    logger.error("Failed to fetch calabrio wfm options from service", { error });
    return false;
  }
};

export const getCalabrioWfmOrg = async (businessUnitId: string, state: AppState, dispatch: (action: Action) => void): Promise<AppState> => {
  let businessUnit = state.calabrioContext.wfmOrg.find((bu: WfmBusinessUnit) => bu.Id === businessUnitId);
  if (businessUnit && businessUnit.Teams) {
    return state;
  } else {
    businessUnit = { ...businessUnit };
    const existingErrors = state.calabrioContext.wfmErrors;

    const res: any = await getWfmOrgServiceCall(state.userContext.tokens.calabrioService, businessUnitId);
    let org;
    let errors = [];

    if (res.data.compressed) {
      const data = await decompressResponse(res.data.data);
      org = data.Teams || [];
      errors = data.errors;
    } else {
      org = res.data.Teams || [];
      errors = res.data.errors;
    }

    businessUnit.Teams = org;

    const strippedOrg = state.calabrioContext.wfmOrg.filter((bu: WfmBusinessUnit) => bu.Id !== businessUnitId);
    dispatch({
      type: "updateWfmOrg",
      payload: {
        org: [...strippedOrg, businessUnit],
        errors: [...existingErrors, ...errors || []]
      }
    });
    return {
      ...state,
      calabrioContext: {
        ...state.calabrioContext,
        wfmOrg: [...strippedOrg, businessUnit]
      }
    };
  }
};

export const getCalabrioQMUsers = async (accessToken: string, includeInactive = false): Promise<CalabrioUser[]> => {
  const response: any = await getCalabrioUsers(accessToken, includeInactive);
  if (response.data.compressed) {
    const data = decompressResponse(response.data.data);
    return data;
  } else {
    return response.data;
  }
};