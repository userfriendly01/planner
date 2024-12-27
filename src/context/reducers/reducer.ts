import { LIST_MANAGERS } from "globals/graphql/manager";
import { LIST_SOFTPHONE_CONFIG } from "globals/graphql/profile";
import { LIST_RULES } from "globals/graphql/rules";
import { LIST_USERS } from "globals/graphql/user";
import {
  Action,
  AppState
} from "globals/interfaces";
import {
  formatCalabrioTeams,
  formatCalabrioTenant,
  formatCalabrioGroups,
  formatCalabrioRoles
} from "utils/calabrioUtils";

export const initialState: AppState = {
  managerContext: {
    managers: []
  },
  profileContext: {
    profiles: [],
    screenpops: [],
    accessGroups: [],
    activities: [],
    directory: [],
    dialList: [],
    calltags: []
  },
  userContext: {
    permissions: [],
    tokens: {}
  },
  workerContext: {
    workers: [],
    loadStatus: null
  },
  rulesContext: {
    rules: [],
    applications: [],
    ruleRelationships: []
  },
  calabrioContext: {
    tenant: {},
    teams: [],
    groups: [],
    users: [],
    roles: [],
    wfmOrg: [],
    wfmOptions: [],
    wfmErrors: []
  },
  userManagementTableFilters: {
    managerFilter: null,
    profileFilterArray: [],
    ouFilterArray: []
  }
};

export const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "setLoadingWorkers":
      return {
        ...state,
        workerContext: {
          ...state.workerContext,
          loadStatus: action.payload
        }
      };
    case `loadPaginatedResults${LIST_RULES.type}`: {
      const pageResults: { [key:string]: any[] } = action.payload;

      return {
        ...state,
        rulesContext: {
          ...state.rulesContext,
          rules: pageResults.rules ? state.rulesContext.rules.concat(pageResults.rules) : state.rulesContext.rules,
          applications: pageResults.applications ? state.rulesContext.applications.concat(pageResults.applications) : state.rulesContext.applications,
          ruleRelationships: pageResults.ruleRelationships ? state.rulesContext.ruleRelationships.concat(pageResults.ruleRelationships) : state.rulesContext.ruleRelationships
        }
      };
    }
    case `loadPaginatedResults${LIST_MANAGERS.type}`: {
      const pageResults: { [key:string]: any[] } = action.payload;

      return {
        ...state,
        managerContext: {
          ...state.managerContext,
          managers: pageResults.managers ? state.managerContext.managers.concat(pageResults.managers) : state.managerContext.managers
        }
      };
    }
    case `loadPaginatedResults${LIST_USERS.type}`: {
      const pageResults: { [key:string]: any[] } = action.payload;
      return {
        ...state,
        workerContext: {
          ...state.workerContext,
          workers: pageResults.users ? state.workerContext.workers.concat(pageResults.users) : state.workerContext.workers
        }
      };
    }
    case `loadPaginatedResults${LIST_SOFTPHONE_CONFIG.type}`: {
      const pageResults: { [key:string]: any[] } = action.payload;
      return {
        ...state,
        profileContext: {
          ...state.profileContext,
          profiles: pageResults.profiles ? state.profileContext.profiles.concat(pageResults.profiles) : state.profileContext.profiles,
          activities: pageResults.activities ? state.profileContext.activities.concat(pageResults.activities) : state.profileContext.activities,
          screenpops: pageResults.screenpops ? state.profileContext.screenpops.concat(pageResults.screenpops) : state.profileContext.screenpops,
          calltags: pageResults.calltags ? state.profileContext.calltags.concat(pageResults.calltags) : state.profileContext.calltags,
          accessGroups: pageResults.accessGroups ? state.profileContext.accessGroups.concat(pageResults.accessGroups) : state.profileContext.accessGroups,
          dialList: pageResults.dialList ? state.profileContext.dialList.concat(pageResults.dialList) : state.profileContext.dialList,
          directory: pageResults.directory ? state.profileContext.directory.concat(pageResults.directory) : state.profileContext.directory
        }
      };
    }
    case "loadProfileOptions": {
      return {
        ...state,
        profileContext: {
          ...state.profileContext,
          ...action.payload
        }
      };
    }
    case "addManager":
      return {
        ...state,
        managerContext: {
          ...state.managerContext,
          managers: [...state.managerContext.managers.slice(), action.payload]
        }
      };
    case "editManager":
      return {
        ...state,
        managerContext: {
          ...state.managerContext,
          managers: action.payload
        }
      };
    case "loadWfmOrg": {
      const org = Array.isArray(action.payload.org) ? action.payload.org : [];
      const errors = Array.isArray(action.payload.errors) ? action.payload.errors : [];
      const peopleWithoutTeam = Array.isArray(action.payload.People_Without_Team) ? action.payload.People_Without_Team : [];
      return {
        ...state,
        calabrioContext: {
          ...state.calabrioContext,
          wfmOrg: [
            ...org,
            {
              Id: "People_Without_Team",
              Name: "Lost Souls",
              People: peopleWithoutTeam,
              Absences: [],
              Availabilities: [],
              Budget_Groups: [],
              Contracts: [],
              Contract_Schedules: [],
              Optional_Columns: [],
              Part_Time_Percentages: [],
              Roles: [],
              Rotations: [],
              Shift_Bags: [],
              Skills: [],
              Teams: [],
              Workflow_Control_Sets: []
            }
          ],
          wfmErrors: errors
        }
      };
    }
    case "updateWfmOrg": {
      const org = Array.isArray(action.payload.org) ? action.payload.org : [];
      const errors = Array.isArray(action.payload.errors) ? action.payload.errors : state.calabrioContext.wfmErrors;
      return {
        ...state,
        calabrioContext: {
          ...state.calabrioContext,
          wfmOrg: org,
          wfmErrors: errors
        }
      };
    }
    case "loadWfmOptions":
      return {
        ...state,
        calabrioContext: {
          ...state.calabrioContext,
          wfmOptions: action.payload
        }
      };
    case "deleteWorker":
      return {
        ...state,
        workerContext: {
          ...state.workerContext,
          workers: state.workerContext.workers.filter(worker => worker.sid !== action.payload)
        }
      };
    case "loadCalabrioOrg":
      return {
        ...state,
        calabrioContext: {
          ...state.calabrioContext,
          groups: formatCalabrioGroups(action.payload),
          teams: formatCalabrioTeams(action.payload),
          tenant: formatCalabrioTenant(action.payload)
        }
      };
    case "loadCalabrioUsers":
      return {
        ...state,
        calabrioContext: {
          ...state.calabrioContext,
          users: action.payload
        }
      };
    case "loadCalabrioRoles":
      return {
        ...state,
        calabrioContext: {
          ...state.calabrioContext,
          roles: formatCalabrioRoles(action.payload)
        }
      };
    case "addCalabrioTeam":
      return {
        ...state,
        calabrioContext: {
          ...state.calabrioContext,
          teams: [...state.calabrioContext.teams.slice(), action.payload]
        }
      };
    case "updateCalabrioTeam":
      return {
        ...state,
        calabrioContext: {
          ...state.calabrioContext,
          teams: [...state.calabrioContext.teams.filter(t => t.groupId !== action.payload.id), action.payload]
        }
      };
    case "loadProfiles":{
      return {
        ...state,
        profileContext: {
          ...state.profileContext,
          profiles: action.payload
        }
      };
    }
    case "loadUserData":
      return {
        ...state,
        userContext: {
          ...state.userContext,
          ...action.payload
        }
      };
    case "updateWorker":
      return {
        ...state,
        workerContext: {
          ...state.workerContext,
          workers: [...state.workerContext.workers.filter(w => w.sid !== action.payload.sid), action.payload]
        }
      };
    case "updateManagerFilter":
      return {
        ...state,
        userManagementTableFilters: {
          ...state.userManagementTableFilters,
          managerFilter: action.payload
        }
      };
    case "updateProfileFilter":
      return {
        ...state,
        userManagementTableFilters: {
          ...state.userManagementTableFilters,
          profileFilterArray: action.payload
        }
      };
    case "updateOuFilter":
      return {
        ...state,
        userManagementTableFilters: {
          ...state.userManagementTableFilters,
          ouFilterArray: action.payload
        }
      };
    case "resetFilters":
      return {
        ...state,
        userManagementTableFilters: initialState.userManagementTableFilters
      };
    default:
      return state;
  }
};
