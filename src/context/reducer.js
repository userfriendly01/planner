export const initialState = {
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