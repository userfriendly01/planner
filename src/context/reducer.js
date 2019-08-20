export const initialState = {
  managerContext: {
    managers: []
  },
  profileContext: {
    profiles: []
  },
  workerContext: {
    workers: []
  },
  userContext: {
    pingIdentity: ""
  }
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "addManager":
      return {
        ...state,
        managerContext: {
          managers: [...state.managerContext.managers.slice(), action.payload.manager]
        }
      };
    case "loadManagers":
      return {
        ...state,
        managerContext: {
          managers: action.payload
        }
      };
    case "loadProfiles":
      return {
        ...state,
        profileContext: {
          profiles: action.payload
        }
      };
    case "loadWorkers":
      return {
        ...state,
        workerContext: {
          workers: action.payload
        }
      };
    case "loadUserData":
      return {
        ...state,
        userContext: action.payload
      };
    default:
      return state;
  }
};