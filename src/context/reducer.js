export const initialState = {
  managerContext: {
    managers: []
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
  resettingSkills: false
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
          taskrouterSkills: action.payload
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