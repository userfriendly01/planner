import { formModes } from "globals";
import { Action } from "globals/interfaces";
import {
  Application, DayOfWeek, SkillState, Skill, SkillGroup, TimeOfDay, TwilioQueue, SkillFormState
} from "callflowmanagement/Skills.Interfaces";

export const skillActions = {
  RESET_FORM: "RESET_FORM",
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
  discrepancies: [],
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
export const initialSkillFormState: SkillFormState = {
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
};

export const skillReducer = (state: SkillFormState, action: Action): any => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

export const skillFormReducer = (state: SkillFormState, action: Action): SkillFormState => {
  switch (action.type) {
    case skillActions.RESET_FORM: {
      return {
        ...initialSkillFormState
      };
    }
    case skillActions.SET_SKILL_FRIENDLY_NAME: {
      return {
        ...state,
        skillFriendlyName: action.payload
      };
    }
    case skillActions.SET_SKILL_NUM: {
      return {
        ...state,
        skillNum: action.payload
      };
    }
    case skillActions.SET_TASK_QUEUE: {
      return {
        ...state,
        taskQueueSid: action.payload
      };
    }
    case skillActions.SET_PROFILE_IDS: {
      return {
        ...state,
        profileIds: action.payload
      };
    }
    case skillActions.SET_VH_CALL_TARGET: {
      return {
        ...state,
        vhCallTarget: action.payload
      };
    }
    case skillActions.SET_VH_THRESHOLD: {
      return {
        ...state,
        vhThreshold: action.payload
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
        applicationId: action.payload
      };
    }
    case skillActions.SET_ENABLE_VIRTUAL_HOLD: {
      return {
        ...state,
        enableVirtualHold: action.payload
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