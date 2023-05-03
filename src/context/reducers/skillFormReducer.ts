import {
  Action,
  formModes
} from "globals";
import { SkillFormState } from "../../components/tabs/callflowmanagement/SkillManagement/Skills.Interfaces";

export const skillFormActions = {
  RESET_FORM: "RESET_FORM",
  SET_SKILL_FRIENDLY_NAME: "SET_SKILL_FRIENDLY_NAME",
  SET_SKILL_NUM: "SET_SKILL_NUM",
  SET_TASK_QUEUE: "SET_TASK_QUEUE",
  SET_PROFILE_IDS: "SET_PROFILE_IDS",
  SET_VH_CALL_TARGET: "SET_VH_CALL_TARGET",
  SET_VH_THRESHOLD: "SET_VH_THRESHOLD",
  SET_TIME_OF_DAYS: "SET_TIME_OF_DAYS",
  SET_APPLICATION_ID: "SET_APPLICATION_ID",
  SET_ENABLE_VIRTUAL_HOLD: "SET_ENABLE_VIRTUAL_HOLD",
  SET_UPDATE_SKILL: "SET_UPDATE_SKILL"
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
  timeOfDay: {
    sunday: null,
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null
  }
};

export const skillFormReducer = (state: SkillFormState, action: Action): any => {  //TODO: change the anys
  switch (action.type) {
    case skillFormActions.RESET_FORM: {
      return {
        ...initialSkillFormState
      };
    }
    case skillFormActions.SET_SKILL_FRIENDLY_NAME: {
      return {
        ...state,
        skillFriendlyName: action.payload
      };
    }
    case skillFormActions.SET_SKILL_NUM: {
      return {
        ...state,
        skillNum: action.payload
      };
    }
    case skillFormActions.SET_TASK_QUEUE: {
      return {
        ...state,
        taskQueueSid: action.payload
      };
    }
    case skillFormActions.SET_PROFILE_IDS: {
      return {
        ...state,
        profileIds: action.payload
      };
    }
    case skillFormActions.SET_VH_CALL_TARGET: {
      return {
        ...state,
        vhCallTarget: action.payload
      };
    }
    case skillFormActions.SET_VH_THRESHOLD: {
      return {
        ...state,
        vhThreshold: action.payload
      };
    }
    case skillFormActions.SET_TIME_OF_DAYS: {
      return {
        ...state,
        timeOfDay: action.payload // ???
      };
    }
    case skillFormActions.SET_APPLICATION_ID: {
      return {
        ...state,
        applicationId: action.payload
      };
    }
    case skillFormActions.SET_ENABLE_VIRTUAL_HOLD: {
      return {
        ...state,
        enableVirtualHold: action.payload
      };
    }
    // case skillFormActions.SET_UPDATE_SKILL:{
    //   return {
    //     ...action.payload
    //   };
    // }

    default: {
      return state;
    }
  }
};