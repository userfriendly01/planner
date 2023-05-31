import {
  Action,
  AppState
} from "globals";
import {
  formatCalabrioTeams,
  formatCalabrioTenant,
  formatCalabrioGroups,
  formatCalabrioRoles
} from "utils/calabrioUtils";
import { formatSkillGroups } from "utils/skillsUtils";

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
    skills: [],
    skillGroups: []
  },
  userContext: {
    pingIdentity: null,
    authenticationProfiles: []
  },
  workerContext: {
    workers: []
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
    case "loadWorkers":
      return {
        ...state,
        workerContext: {
          workers: action.payload
        }
      };
    case "updateWfmOrg":
      return {
        ...state,
        calabrioContext: {
          ...state.calabrioContext,
          wfmOrg: action.payload
        }
      };
    case "loadWfmOrg": {
      const org = action.payload.org;
      const errors = action.payload.errors;
      return {
        ...state,
        calabrioContext: {
          ...state.calabrioContext,
          wfmOrg: [
            ...org,
            {
              Id: "People_Without_Team",
              Name: "Lost Souls",
              People: action.payload.People_Without_Team
            }
          ],
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
    case "loadSkills":
      return {
        ...state,
        skillContext: {
          ...state.skillContext,
          skills: action.payload
        }
      };
    case "loadSkillGroups":
      return {
        ...state,
        skillContext: {
          ...state.skillContext,
          skillGroups: formatSkillGroups(action.payload)
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