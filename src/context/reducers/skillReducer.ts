import { formModes } from "globals";
import { Action } from "globals/interfaces";
import {
  Skill, SkillFormState, SkillState,
  TimeOfDay,
  TwilioQueue
} from "callflowmanagement/Skills.Interfaces";
import { constructLevels } from "utils/skillsUtils";

export const skillActions = {
  RESET_FORM: "RESET_FORM",
  ADD_SKILL: "ADD_SKILL",
  UPDATE_SKILL: "UPDATE_SKILL",
  DELETE_SKILL: "DELETE_SKILL",
  ADD_SKILL_GROUP: "ADD_SKILL_GROUP",
  UPDATE_SKILL_GROUP: "UPDATE_SKILL_GROUP",
  DELETE_SKILL_GROUP: "DELETE_SKILL_GROUP",
  LOAD_SKILL_STATE: "LOAD_SKILL_STATE",
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
    case skillActions.ADD_SKILL: {
      const skillForm: SkillFormState = action.payload;
      const consolidatedSkill = {
        discrepancies: [] as string[],
        name: skillForm.name,
        levels: constructLevels(skillForm.levels.min?.value, skillForm.levels.max?.value) || [],
        profileIds: skillForm.profileIds,
        taskQueueSid: skillForm.taskQueue.sid,
        taskQueueName: skillForm.taskQueue.friendly_name,
        skillGroupIds: [] as string[],
        applicationId: skillForm.applicationId,
        closedMessage: null as null,
        flashMessage: null as null,
        timeOfDays: skillForm.timeOfDays,
        vhCallTarget: skillForm.vhCallTarget,
        vhThreshold: skillForm.vhThreshold
      };
      return {
        ...state,
        taskQueues: skillForm.taskQueue.isNew ? [...state.taskQueues, skillForm.taskQueue] : state.taskQueues,
        skills: [...state.skills, consolidatedSkill]
      };
    }
    case skillActions.UPDATE_SKILL: {
      const skillsCopy = state.skills.slice();
      const changes = { ...action.payload.changes };
      const taskQueue = action.payload.taskQueue;

      const skillName = action.payload.skillName;
      const skillIndex = state.skills.findIndex(s => s.name === skillName);

      if(changes.levels){
        changes.levels = constructLevels(changes.levels.min?.value, changes.levels.max?.value) || [];
      }

      if(changes.taskQueue){
        changes.taskQueueName = taskQueue?.friendly_name;
        changes.taskQueueSid = taskQueue.sid;
        delete changes.taskQueue;
      }

      if(changes.timeOfDays){
        const timeOfDayCopy = skillsCopy[skillIndex].timeOfDays.slice();
        changes.timeOfDays = timeOfDayCopy.map(tod => changes.timeOfDays.find((t: TimeOfDay) => t.dayOfWeekId === tod.dayOfWeekId) || tod);
      }

      skillsCopy[skillIndex] = {
        ...state.skills[skillIndex],
        ...changes,
        discrepancies: []
      };

      return {
        ...state,
        taskQueues: action.payload.taskQueue ? [...state.taskQueues, taskQueue] : state.taskQueues,
        skills: skillsCopy
      };
    }
    case skillActions.DELETE_SKILL:{
      const skillName = action.payload.skillName;
      const taskQueueSid = action.payload.taskQueue;
      const skills = state.skills.filter(s => s.name !== skillName);
      const taskQueues = taskQueueSid ? state.taskQueues.filter(s => s.sid !== taskQueueSid) : state.taskQueues;
      return {
        ...state,
        skills,
        taskQueues
      };
    }
    case skillActions.ADD_SKILL_GROUP: {
      const skillGroup = action.payload;
      const skills = JSON.parse(JSON.stringify(state.skills)).slice().map((s: Skill) => {
        if(skillGroup.skills.includes(s.name)){
          if(s.skillGroupIds){
            s.skillGroupIds.push(skillGroup.id);
          } else {
            s.skillGroupIds = [skillGroup.id ];
          }
        }
        return s;
      });
      return {
        ...state,
        skills,
        skillGroups: [...state.skillGroups, skillGroup]
      };
    }
    case skillActions.UPDATE_SKILL_GROUP: {
      const skillGroupsCopy = state.skillGroups.slice();
      const skillGroup = action.payload.skillGroup;
      const id = action.payload.id;
      const skillGroupIndex = state.skillGroups.findIndex(s => s.id === id);

      skillGroupsCopy[skillGroupIndex] = {
        ...skillGroupsCopy[skillGroupIndex],
        ...skillGroup
      };

      const skills = state.skills.slice().map(s => {
        const skillGroupSkillNames = skillGroup.skills || []; //["LibertyBillingOps", "MeganSkill", "466"];
        const skillGroupIds = s.skillGroupIds || []; //['2j0ldPJKFQV96dBSbwtBRdK6fha', '2nAW8g8Jxb07bTiO4q2ZQWuuect'] 
        const skillInSkillGroupNames = skillGroupSkillNames.includes(s.name);
        const skillGroupIdInSkill = skillGroupIds.includes(skillGroup.id);

        if(skillInSkillGroupNames && !skillGroupIdInSkill){ //Add the group Id to the skill.skillGroupIds
          s.skillGroupIds = [...skillGroupIds, skillGroup.id];
        } else if(!skillInSkillGroupNames && skillGroupIdInSkill){ // Remove the group Id from the skill.skillGroupIds
          s.skillGroupIds = skillGroupIds.filter(id => id !== skillGroup.id);
        }

        return s;
      });
      return {
        ...state,
        skills,
        skillGroups: skillGroupsCopy
      };
    }
    case skillActions.DELETE_SKILL_GROUP: {
      const skillGroupId = action.payload;
      const skillGroups = state.skillGroups.filter(s => s.id !== skillGroupId);
      const skills = state.skills.slice().map(s => {
        if(s.skillGroupIds?.includes(skillGroupId)){
          s.skillGroupIds = s.skillGroupIds.filter(sg => sg !== skillGroupId);
        }
        return s;
      });
      return {
        ...state,
        skillGroups,
        skills
      };
    }
    case skillActions.LOAD_SKILL_STATE:
      return {
        ...state,
        skills: action.payload.skills,
        skillGroups: action.payload.skillGroups,
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