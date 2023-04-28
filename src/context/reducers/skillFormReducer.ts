import {
  Action,
  formModes
} from "globals";

export const skillFormActions = {
  RESET_FORM: "RESET_FORM",
  SET_SKILL_FRIENDLY_NAME: "SET_SKILL_FRIENDLY_NAME",
  SET_SKILL_NUM: "SET_SKILL_NUM",
  SET_TASK_QUEUE: "SET_TASK_QUEUE",
  SET_PROFILES: "SET_PROFILES",
  SET_VH_CALL_TARGET: "SET_VH_CALL_TARGET",
  SET_VH_THRESHOLD: "SET_VH_THRESHOLD",
  SET_TIME_OF_DAYS: "SET_TIME_OF_DAYS"
};

export const initialSkillFormState: any = {
  formMode: formModes.INSERT,
  skillFriendlyName: "",
  skillNum: "",
  taskQueue: "",
  profiles: [],
  vhCallTarget: "",
  vhThreshold: null,
  timeOfDays: {} // ???  What is this going to look like?
};

export const skillFormReducer = (state: any, action: Action): any => {  //TODO: change the anys
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
        taskQueue: action.payload
      };
    }
    case skillFormActions.SET_PROFILES: {
      return {
        ...state,
        profiles: action.payload
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
        timeOfDays: action.payload // ???
      };
    }

    default: {
      return state;
    }
  }
};