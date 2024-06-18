import { formModes } from "globals";
import { Action } from "globals/interfaces";
import {
  Application, DayOfWeek, SkillState, Skill, SkillGroup, TimeOfDay, TwilioQueue, SkillFormState
} from "callflowmanagement/Skills.Interfaces";
import { formatSkillGroups } from "utils/skillsUtils";

export const skillActions = {
  RESET_FORM: "RESET_FORM",
  LOAD_SKILLS: "LOAD_SKILLS",
  LOAD_SKILL_GROUPS: "LOAD_SKILL_GROUPS",
  LOAD_SKILL_OPTIONS: "LOAD_SKILL_OPTIONS",
  SET_SKILL_FRIENDLY_NAME: "SET_SKILL_FRIENDLY_NAME",
  SET_SKILL_NUM: "SET_SKILL_NUM",
  SET_TASK_QUEUE: "SET_TASK_QUEUE",
  SET_PROFILE_IDS: "SET_PROFILE_IDS",
  SET_VH_CALL_TARGET: "SET_VH_CALL_TARGET",
  SET_VH_THRESHOLD: "SET_VH_THRESHOLD",
  SET_VH_TIME_OF_DAYS: "SET_VH_TIME_OF_DAYS",
  SET_TIME_OF_DAYS: "SET_TIME_OF_DAYS",
  SET_APPLICATION_ID: "SET_APPLICATION_ID",
  SET_ENABLE_VIRTUAL_HOLD: "SET_ENABLE_VIRTUAL_HOLD",
  SET_UPDATE_SKILL: "SET_UPDATE_SKILL"
};

export const initialSkillState: SkillState = {
  skills: [],
  skillGroups: [],
  applications: [],
  daysOfWeek: {
    sunday: 1,
    monday: 2,
    tuesday: 3,
    wednesday: 4,
    thursday: 5,
    friday: 6,
    saturday: 7
  },
  timeOfDays: [],
  taskQueues: [],
  skillForm: {
    formMode: formModes.INSERT,
    skillFriendlyName: "",
    skillNum: "",
    applicationId: null,
    taskQueueSid: "",
    profileIds: [],
    enableVirtualHold: false,
    vhCallTarget: {
      value: "",
      valid: false,
      e164: "",
      blurred: false
    },
    vhThreshold: "",
    timeOfDays: []
  }
};

export const skillReducer = (state: SkillState, action: Action): SkillState => {
  switch (action.type) {
    case skillActions.LOAD_SKILLS:
      return {
        ...state,
        skills: action.payload
      };
    case skillActions.LOAD_SKILL_GROUPS:
      return {
        ...state,
        skillGroups: formatSkillGroups(action.payload)
      };
    case skillActions.LOAD_SKILL_OPTIONS:
      return {
        ...state,
        applications: action.payload.applications,
        timeOfDays: action.payload.timeOfDays,
        taskQueues: action.payload.taskQueues
      };
    case skillActions.RESET_FORM: {
      return {
        ...state,
        skillForm: {
          ...initialSkillState.skillForm
        }
      };
    }
    case skillActions.SET_SKILL_FRIENDLY_NAME: {
      return {
        ...state,
        skillForm: {
          ...state.skillForm,
          skillFriendlyName: action.payload
        }
      };
    }
    case skillActions.SET_SKILL_NUM: {
      return {
        ...state,
        skillForm: {
          ...state.skillForm,
          skillNum: action.payload
        }
      };
    }
    case skillActions.SET_TASK_QUEUE: {
      return {
        ...state,
        skillForm: {
          ...state.skillForm,
          taskQueueSid: action.payload
        }
      };
    }
    case skillActions.SET_PROFILE_IDS: {
      return {
        ...state,
        skillForm: {
          ...state.skillForm,
          profileIds: action.payload
        }
      };
    }
    case skillActions.SET_VH_CALL_TARGET: {
      return {
        ...state,
        skillForm: {
          ...state.skillForm,
          vhCallTarget: action.payload
        }
      };
    }
    case skillActions.SET_VH_THRESHOLD: {
      return {
        ...state,
        skillForm: {
          ...state.skillForm,
          vhThreshold: action.payload
        }
      };
    }
    case skillActions.SET_TIME_OF_DAYS: {
      return {
        ...state,
        timeOfDays: [...state.timeOfDays, action.payload]
      };
    }
    case skillActions.SET_APPLICATION_ID: {
      return {
        ...state,
        skillForm: {
          ...state.skillForm,
          applicationId: action.payload
        }
      };
    }
    case skillActions.SET_ENABLE_VIRTUAL_HOLD: {
      return {
        ...state,
        skillForm: {
          ...state.skillForm,
          enableVirtualHold: action.payload
        }
      };
    }
    // case skillActions.SET_UPDATE_SKILL:{
    //   return {
    //     ...action.payload
    //   };
    // }

    default: {
      return state;
    }
  }
};