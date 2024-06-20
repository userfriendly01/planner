import { formModes } from "globals";
import { Action } from "globals/interfaces";
import {
  Application, SkillState, Skill, SkillGroup, TimeOfDay, TwilioQueue, SkillFormState
} from "callflowmanagement/Skills.Interfaces";
import { formatSkillGroups } from "utils/skillsUtils";

export const skillActions = {
  RESET_FORM: "RESET_FORM",
  LOAD_SKILLS: "LOAD_SKILLS",
  LOAD_SKILL_GROUPS: "LOAD_SKILL_GROUPS",
  LOAD_SKILL_OPTIONS: "LOAD_SKILL_OPTIONS",
  SET_FORM_FIELD: "SET_FORM_FIELD",
  CLEAR_FORM_FIELD: "CLEAR_FORM_FIELD",
  SET_TIME_OF_DAYS: "SET_TIME_OF_DAYS"
};

export const initialSkillState: SkillState = {
  skills: [],
  skillGroups: [],
  applications: [],
  daysOfWeek: {
    sunday: {
      label: "Sunday",
      id: 1
    },
    monday: {
      label: "Monday",
      id: 2
    },
    tuesday: {
      label: "Tuesday",
      id: 3
    },
    wednesday: {
      label: "Wednesday",
      id: 4
    },
    thursday: {
      label: "Thursday",
      id: 5
    },
    friday: {
      label: "Friday",
      id: 6
    },
    saturday: {
      label: "Saturday",
      id: 7
    }
  },
  timeOfDays: [],
  taskQueues: [],
  operatingUnits: [],
  skillForm: {
    formMode: formModes.INSERT,
    name: "",
    applicationId: null,
    taskQueue: {
      isNew: false,
      target_workers: null,
      sid: "",
      friendly_name: null,
      operating_unit_sid: null
    },
    profileIds: [],
    vhCallTarget: "",
    vhCallerId: {
      value: "",
      e164: ""
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
        taskQueues: action.payload.taskQueues,
        operatingUnits: action.payload.operatingUnits
      };
    case skillActions.RESET_FORM: {
      return {
        ...state,
        skillForm: {
          ...initialSkillState.skillForm
        }
      };
    }
    case skillActions.SET_FORM_FIELD: {
      const key = action.payload.key;
      const value = action.payload.value;
      return {
        ...state,
        skillForm: {
          ...state.skillForm,
          [key]: value
        }
      };
    }
    case skillActions.CLEAR_FORM_FIELD: {
      const key = action.payload;
      return {
        ...state,
        skillForm: {
          ...state.skillForm,
          [key]: initialSkillState.skillForm[key]
        }
      };
    }
    case skillActions.SET_TIME_OF_DAYS: {
      const dayOfWeekId = action.payload.dayOfWeekId;
      const day = state.skillForm.timeOfDays.find(tod => tod.dayOfWeekId === dayOfWeekId);
      if(day) {
        const days = state.skillForm.timeOfDays.filter(tod => tod.dayOfWeekId !== dayOfWeekId);
        const updatedDay = {
          ...day,
          ...action.payload
        };
        return {
          ...state,
          skillForm: {
            ...state.skillForm,
            timeOfDays: [...days, updatedDay]
          }
        };
      } else {
        return {
          ...state,
          skillForm: {
            ...state.skillForm,
            timeOfDays: [...state.skillForm.timeOfDays, action.payload]
          }
        };
      }
    }
    default: {
      return state;
    }
  }
};