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
  officeContext: {
    offices: []
  },
  profileContext: {
    profiles: []
  },
  userContext: {
    permissions: [],
    tokens: {}
  },
  workerContext: {
    workers: [],
    loadStatus: null
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
    case "loadPaginatedResults": {
      const type: string = action.payload.type;
      const pageResults: any[] = action.payload.results;

      if(type === "UMSoftphoneConfiguration"){
        console.log("PROFILES ", pageResults);
      }

      return {
        ...state,
        managerContext: {
          ...state.managerContext,
          managers: type === "UMManager" ? state.managerContext.managers.concat(pageResults) : state.managerContext.managers
        },
        officeContext: {
          ...state.officeContext,
          offices: type === "UMOffice" ? state.officeContext.offices.concat(pageResults) : state.officeContext.offices
        },
        workerContext: {
          ...state.workerContext,
          workers: type === "UMUser" ? state.workerContext.workers.concat(pageResults) : state.workerContext.workers
        },
        profileContext: {
          ...state.profileContext,
          profiles: type === "UMSoftphoneConfiguration" ? state.profileContext.profiles.concat(pageResults) : state.profileContext.profiles
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
    case "addOffice":
      return {
        ...state,
        officeContext: {
          ...state.officeContext,
          offices: [...state.officeContext.offices.slice(), action.payload]
        }
      };
    case "addWorkers":
      return {
        ...state,
        workerContext: {
          ...state.workerContext,
          workers: state.workerContext.workers.concat(action.payload)
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