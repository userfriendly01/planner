import { apiPaths } from "globals";
import { Skill } from "callflowmanagement/Skills.Interfaces";
import { AxiosResponse } from "axios";
import { escapeQuotes } from "utils";
import { myAxios } from "utils/myAxios";
import {
  Action, Tokens
} from "globals/interfaces";
import { logger } from "utils/logger";
import { skillActions } from "context/reducers/skillReducer";

export interface UpdateMessageRequestBody {
  skillName: string;
  message: string;
  nNumber: string;
}
export const updateFlashMessage = async (payload: UpdateMessageRequestBody, tokens: Tokens, dispatch: (action: Action) => void): Promise<AxiosResponse<any>> => {
  const req = {
    skill: payload.skillName,
    flashMessage: escapeQuotes(payload.message),
    updatedBy: payload.nNumber
  };
  const config = {
    headers: {
      Authorization: `Bearer ${tokens.adminService}`
    }
  };
  try {
    await myAxios.put(apiPaths.FLASH_MESSAGE, req, config);
    dispatch({
      type: skillActions.UPDATE_SKILL,
      payload: {
        skillName: payload.skillName,
        changes: {
          flashMessage: payload.message
        }
      }
    });
    return;
  } catch(err){
    logger.error("updateFlashMessage - Error thrown", err);
    throw err;
  }
};

export const updateClosedMessage = async (payload: UpdateMessageRequestBody, tokens: Tokens, dispatch: (action: Action) => void): Promise<AxiosResponse<any>> => {
  const req = {
    skill: payload.skillName,
    closedMessage: escapeQuotes(payload.message),
    updatedBy: payload.nNumber
  };
  const config = {
    headers: {
      Authorization: `Bearer ${tokens.adminService}`
    }
  };
  try {
    await myAxios.put(apiPaths.CLOSED_MESSAGE, req, config);
    dispatch({
      type: skillActions.UPDATE_SKILL,
      payload: {
        skillName: payload.skillName,
        changes: {
          closedMessage: payload.message
        }
      }
    });
    return;
  } catch(err){
    logger.error("updateClosedMessage - Error thrown", err);
    throw err;
  }
};