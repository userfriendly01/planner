import { formModes } from "globals";
import { Action } from "globals/interfaces";
import {
  DayOfWeek,
  Skill, SkillState,
  TimeOfDay,
  TwilioQueue
} from "callflowmanagement/Skills.Interfaces";

export const skillActions = {
  RESET_FORM: "RESET_FORM",
  LOAD_SKILLS: "LOAD_SKILLS",
  LOAD_SKILL_GROUPS: "LOAD_SKILL_GROUPS",
  LOAD_SKILL_OPTIONS: "LOAD_SKILL_OPTIONS",
  SET_FORM_FIELD: "SET_FORM_FIELD",
  CLEAR_FORM_FIELD: "CLEAR_FORM_FIELD",
  SET_TIME_OF_DAYS: "SET_TIME_OF_DAYS",
  SET_UPDATE_SKILL_FORM: "SET_UPDATE_SKILL_FORM"
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
    levels: {
      min: null,
      max: null
    },
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
        skillGroups: action.payload
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
    case skillActions.SET_UPDATE_SKILL_FORM: {
      const skill: Skill = action.payload.skill;
      const taskQueue: Partial<TwilioQueue> = action.payload.taskQueue || {};

      console.log("Faith skill", skill);
      console.log("Faith taskQueue", taskQueue);

      return {
        ...state,
        skillForm: {
          formMode: formModes.UPDATE,
          name: skill.name,
          levels: {
            min: skill.levels && skill.levels[0] ? {
              value: skill.levels[0],
              label: skill.levels[0].toString()
            } : null,
            max: skill.levels && skill.levels[skill.levels.length - 1] ? {
              value: skill.levels[skill.levels.length - 1],
              label: skill.levels[skill.levels.length - 1].toString()
            } : null
          },
          applicationId: skill.applicationId,
          taskQueue: {
            isNew: false,
            target_workers: taskQueue.target_workers || "",
            sid: taskQueue.sid || "",
            friendly_name: taskQueue.friendly_name || null,
            operating_unit_sid: taskQueue.operating_unit_sid
          },
          profileIds: skill.profileIds || [],
          vhCallTarget: skill.vhCallTarget || null,
          vhThreshold: skill.vhThreshold?.toString() || null,
          timeOfDays: Object.values(state.daysOfWeek).map((dow: any) => {
            const dayOfWeekId = dow.id;
            const dayOfWeekDetails = skill.timeOfDays?.find((tod: any) => tod.dayOfWeekId === dayOfWeekId);
            return {
              dayOfWeekId,
              timeOfDayId: dayOfWeekDetails?.timeOfDayId,
              vhTimeOfDayId: dayOfWeekDetails?.vhTimeOfDayId
            };
          })
        }
      };
    }
    default: {
      return state;
    }
  }
};