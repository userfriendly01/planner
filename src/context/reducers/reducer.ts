import {
  Action,
  AppState
} from "globals";
import {
  formatCalabrioTeams,
  formatCalabrioGroups,
  formatCalabrioUsers
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
  skillContext: {
    taskrouterSkills: []
  },
  userContext: {
    pingIdentity: {}
  },
  workerContext: {
    workers: [],
    selectedWorkers: []
  },
  calabrioContext: {
    tenant: {},
    teams: [],
    groups: [],
    users: []
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
      console.log("**Final Manager Payload: ", action.payload);
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
          users: formatCalabrioUsers(action.payload)
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
    case "loadSkills":
      return {
        ...state,
        skillContext: {
          ...state.skillContext,
          taskrouterSkills: action.payload
        }
      };
    case "loadUserData":
      return {
        ...state,
        userContext: action.payload
      };
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
    default:
      return state;
  }
};