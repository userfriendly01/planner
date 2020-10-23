export interface Action {
  type: string,
  [key: string]: any
}

export interface AppState {
  managerContext: {
    managers: Manager[]
  },
  profileContext: {
    profiles: any[]
  },
  skillContext: {
    taskrouterSkills: any[]
  },
  userContext: {
    pingIdentity: any
  },
  workerContext: {
    workers: TwilioWorker[],
    selectedWorkers: TwilioWorker[]
  },
  resettingSkills: false
}

export interface Manager {
  manager_first_name: string,
  manager_last_name: string,
  manager_n_number: string
}

export interface TwilioWorkerSkills {
  levels: {
    [key: string]: number
  },
  skills: string[]
}

export interface TwilioWorker {
  attributes: {
    contact_uri: string,
    default_skills?: TwilioWorkerSkills,
    did?: string,
    disabled_skills?: TwilioWorkerSkills,
    email?: string,
    email_address?: string,
    emp_first_name?: string,
    emp_last_name?: string,
    extension?: string,
    full_name?: string,
    manager_first_name?: string,
    manager_last_name?: string,
    manager_n_number?: string,
    n_number?: string,
    office_location_name?: string,
    office_location_number?: string,
    primary_dept_name?: string,
    primary_dept_number?: string,
    profile_id?: string | number,
    roles: string[],
    routing?: TwilioWorkerSkills,
    unique_id?: string
  },
  id: string,
  sid: string,
  skillsDifferent: boolean
}

export const initialState: AppState = {
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

export const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "addManager":
      return {
        ...state,
        managerContext: {
          ...state.managerContext,
          managers: [...state.managerContext.managers.slice(), action.payload.manager]
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