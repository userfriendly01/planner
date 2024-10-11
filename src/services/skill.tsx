import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";
import { logger } from "utils/logger";
import {
  Application,
  TimeOfDay, TwilioQueue, SkillFormState,
  SkillGroup,
  ConsolidatedSkill
} from "callflowmanagement/SkillManagement/Skills.Interfaces";
import {
  Action, OperatingUnit,
  Tokens
} from "globals/interfaces";
import { AxiosResponse } from "axios";
import { skillActions } from "context/reducers/skillReducer";
import { getOperatingUnits } from "./operatingUnits";

interface CreateSkillRequestBody {
  skills: ConsolidatedSkill[];
  skillForm: SkillFormState;
  updatedBy: string;
}

interface CreateSkillResponseBody {
  status: number;
  messages?: string[];
  data?: {
    taskQueue: TwilioQueue
  }
}
export const createSkill = async (tokens: Tokens, payload: CreateSkillRequestBody, dispatch: (action: Action) => void): Promise<any> => {
  try {
    const response: AxiosResponse<CreateSkillResponseBody> =  await myAxios.post(apiPaths.SKILL, payload, {
      headers: {
        Authorization: `Bearer ${tokens.adminService}`
      }
    });

    if(response.data.status === 206){
      logger.error("createSkill partially failed. State not updated", { messages: response.data.messages });
    } else {
      dispatch({
        type: skillActions.ADD_SKILL,
        payload: {
          ...payload.skillForm,
          taskQueue: payload.skillForm.taskQueue.isNew ? {
            isNew: true,
            taskQueue: response.data.data.taskQueue
          } : payload.skillForm.taskQueue
        }
      });
    }
    return response.data;
  } catch(err){
    logger.error("createSkill - Error thrown", err);
    throw err;
  }
};

interface UpdateSkillRequestBody {
  skillName: string;
  skills: ConsolidatedSkill[];
  changes: Partial<SkillFormState>;
  updatedBy: string;
}

interface UpdateSkillResponseBody {
  status: number;
  messages?: string[];
  data?: {
    taskQueue: TwilioQueue
  }
}
export const updateSkill = async (tokens: Tokens, payload: UpdateSkillRequestBody, dispatch: (action: Action) => void): Promise<any> => {
  try {
    const response: AxiosResponse<UpdateSkillResponseBody> =  await myAxios.put(apiPaths.SKILL, payload, {
      headers: {
        Authorization: `Bearer ${tokens.adminService}`
      }
    });

    if(response.data.status === 206){
      logger.error("updateSkill partially failed. State not updated", { messages: response.data.messages });
    } else {
      dispatch({
        type: skillActions.UPDATE_SKILL,
        payload: {
          skillName: payload.skillName,
          changes: payload.changes,
          taskQueue: (payload.changes.taskQueue && payload.changes.taskQueue.isNew) ? response.data.data.taskQueue: null
        }
      });
    }
    return response.data;
  } catch(err){
    logger.error("updateSkill - Error thrown", err);
    throw err;
  }
};

interface DeleteSkillRequestParams {
  skill: string;
  taskQueueSid: string | null;
  taskQueueName: string | null;
  deleteQueues: boolean;
  updatedBy: string;
}

interface DeleteSkillResponseBody {
  status: number;
  messages?: string[];
}
const deleteSkill = async (tokens: Tokens, params: DeleteSkillRequestParams, dispatch: (action: Action) => void): Promise<any> => {
  try {
    const response: AxiosResponse<DeleteSkillResponseBody> =  await myAxios.delete(apiPaths.SKILL, {
      headers: {
        Authorization: `Bearer ${tokens.adminService}`
      },
      params
    });

    if(response.data.status === 206){
      logger.error("deleteSkill partially failed. State not updated", { messages: response.data.messages });
    } else {
      dispatch({
        type: skillActions.DELETE_SKILL,
        payload: {
          skillName: params.skill,
          taskQueue: params.deleteQueues && params.taskQueueSid
        }
      });
    }
    return response.data;
  } catch(err){
    logger.error("deleteSkill - Error thrown", err);
    throw err;
  }
};

export const deleteSkills = async (
  tokens: Tokens,
  skills: DeleteSkillRequestParams[],
  dispatch?: (action: Action) => void
) => {
  let currentIndex = 0;
  const totalCalls = skills.length;
  const concurrencyMax = 1;
  const processingResults: any = [];
  const delay = () => new Promise(resolve => setTimeout(resolve, 1500));

  const processBatch = async (): Promise<any> => {
    const endingIndex = currentIndex + concurrencyMax;
    const processingRows = skills.slice(currentIndex, endingIndex);
    await delay();

    const results = await Promise.allSettled(processingRows.map((skill: any) => {
      return deleteSkill(tokens, skill, dispatch);
    }));

    results.forEach((p: any) => processingResults.push(p));
    currentIndex = currentIndex + concurrencyMax;
    if(currentIndex < totalCalls){
      return processBatch();
    } else {
      Promise.resolve();
    }
  };

  await processBatch();
  console.warn("hmm", processingResults);
  logger.log("***deleteSkillsConcurrently - processingResults", processingResults.slice());
  return processingResults;
};

interface GetSkillResponseBody {
  consolidatedSkills: ConsolidatedSkill[];
  skillGroups: SkillGroup[];
  skillProfileRelationships: unknown[];
  skillSkillGroupRelationships: unknown[];
  taskQueues: TwilioQueue[]
}

export const loadSkillState = async (accessTokens: Tokens, dispatch: (action: Action) => void): Promise<void> => {
  const config = {
    headers: {
      Authorization: `Bearer ${accessTokens.adminService}`
    }
  };
  try {
    const skillsPromise: Promise<AxiosResponse<GetSkillResponseBody>> = myAxios.get(apiPaths.SKILL, config);
    const applicationsPromise: Promise<AxiosResponse<Application[]>> = myAxios.get(apiPaths.APPLICATIONS, config);
    const timeOfDaysPromise: Promise<AxiosResponse<TimeOfDay[]>> = myAxios.get(apiPaths.TIME_OF_DAYS, config);
    const operatingUnitsPromise: Promise<OperatingUnit[]> = getOperatingUnits(accessTokens);


    const response = await Promise.all([skillsPromise, applicationsPromise, timeOfDaysPromise, operatingUnitsPromise]);
    const skills = response[0].data.consolidatedSkills;
    const skillGroups = response[0].data.skillGroups;
    const taskQueues = response[0].data.taskQueues;
    const applications = response[1].data;
    const timeOfDays = response[2].data;
    const operatingUnits = response[3];

    dispatch({
      type: skillActions.LOAD_SKILL_STATE,
      payload: {
        skills,
        skillGroups,
        applications,
        timeOfDays,
        taskQueues,
        operatingUnits
      }
    });

    return;
  } catch(err){
    logger.error("loadSkillState - Error thrown", err);
    throw err;
  }
};