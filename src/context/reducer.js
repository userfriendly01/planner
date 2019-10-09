export const initialState = {
  managerContext: {
    managers: []
  },
  profileContext: {
    profiles: []
  },
  userContext: {
    pingIdentity: {}
  },
  workerContext: {
    workers: [],
    selectedWorkers: []
  },
  skillContext: {
    availableSkills: []
  }
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "addManager":
      return {
        ...state,
        managerContext: {
          ...state.managerContext,
          managers: [...state.managerContext.managers.slice(), action.payload.manager]
        }
      };
    case "addWorker":
      return {
        ...state,
        workerContext: {
          ...state.workerContext,
          workers: [...state.workerContext.workers.slice(), action.payload]
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
    case "loadProfiles":
      return {
        ...state,
        profileContext: {
          ...state.profileContext,
          profiles: action.payload
        }
      };
    case "loadSkills":
      return {
        ...state,
        skillContext: {
          ...state.skillsContext,
          availableSkills: action.payload
        }
      };
    case "loadWorkers":
      return {
        ...state,
        workerContext: {
          ...state.workerContext,
          workers: action.payload
        }
      };
    case "loadUserData":
      return {
        ...state,
        userContext: action.payload
      };
    case "toggleWorkerSelected":
      return {
        ...state,
        workerContext: {
          ...state.workerContext,
          selectedWorkers:
            state.workerContext.selectedWorkers.find(sid => sid === action.payload)
              ? state.workerContext.selectedWorkers.filter(sid => sid !== action.payload)
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