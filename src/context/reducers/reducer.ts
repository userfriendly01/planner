import {
  Action,
  AppState
} from "globals";
import {
  checkIfAdmin,
  formatCalabrioTeams,
  formatCalabrioTenant,
  formatCalabrioGroups,
  formatCalabrioRoles,
  getWorkerProfileId
} from "utils";

export const initialState: AppState = {
  managerContext: {
    managers: []
  },
  officeContext: {
    offices: new Map()
  },
  profileContext: {
    profiles: []
  },
  activityContext: {
    activities: []
  },
  skillContext: {
    skills: []
  },
  userContext: {
    pingIdentity: null,
    isAdmin: false,
    profileId: null
  },
  workerContext: {
    workers: [],
    selectedWorkers: []
  },
  calabrioContext: {
    tenant: {},
    teams: [],
    groups: [],
    users: [],
    roles: []
  },
  resettingSkills: false
};

export const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
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
          offices: new Map(state.officeContext.offices).set(action.payload.office_num, action.payload)
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
    case "deleteWorker":
      return {
        ...state,
        workerContext: {
          ...state.workerContext,
          workers: state.workerContext.workers.filter(worker => worker.sid !== action.payload)
        }
      };
    case "loadManagers":
      return {
        ...state,
        managerContext: {
          ...state.managerContext,
          managers: action.payload
        }
      };
    case "loadOffices":
      return {
        ...state,
        officeContext: {
          ...state.officeContext,
          offices: new Map(action.payload)
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
    case "loadActivities":{
      return {
        ...state,
        activityContext: {
          ...state.activityContext,
          activities: action.payload
        }
      };
    }
    case "loadSkills":
      return {
        ...state,
        skillContext: {
          ...state.skillContext,
          skills: action.payload
        }
      };
    case "loadUserData":
      return {
        ...state,
        userContext: action.payload
      };
    case "setAuthenticationOnUser": {
      const profileId: number = getWorkerProfileId(state);
      return {
        ...state,
        userContext: {
          ...state.userContext,
          profileId,
          isAdmin: checkIfAdmin(profileId)
        }
      };
    }
    case "resettingSkills":
      return {
        ...state,
        resettingSkills: action.payload
      };
    case "toggleWorkerSelected":
      return {
        ...state,
        workerContext: {
          ...state.workerContext,
          selectedWorkers:
            state.workerContext.selectedWorkers.find(worker => worker.sid === action.payload.sid)
              ? state.workerContext.selectedWorkers.filter(worker => worker.sid !== action.payload.sid)
              : [...state.workerContext.selectedWorkers, action.payload]
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
    case "updateSkills":
      return {
        ...state,
        skillContext: {
          ...state.skillContext,
          skills: action.payload
        }
      };
    default:
      return state;
  }
};