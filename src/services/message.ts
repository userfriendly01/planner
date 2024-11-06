import { apiPaths } from "globals";
import { AxiosResponse } from "axios";
import { apolloClient } from "../components/core/Auth/SharedGraphAPIProvider";
import { escapeQuotes } from "utils";
import { myAxios } from "utils/myAxios";
import {
  Action, Tokens
} from "globals/interfaces";
import { logger } from "utils/logger";
import { skillActions } from "context/reducers/skillReducer";
import {
  UPDATE_SKILL,
  DELETE_SKILL
} from "../globals/graphql/skill";

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
  // ToDo: Create GraphQL string to update the Flash Message
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
    try {
      // ToDo: 
      return;
    } catch (err) {
      logger.error("Failed to update Flash message in UMUser storage", err);
    }
  } catch(err){
    logger.error("Failed to update Flash message in Shared Admin storage", err);
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
  // ToDo: Create GraphQL string to update the Closed Message
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
    try {
      // ToDo:  Call the shared graph api
      console.log("wsx updateClosedMessage():", payload);
      // const {
      //   errors, data
      // }  = await apolloClient.mutate<{ skillGroup: { keys: { pk: string, sk: string}[]} }>({
      //   mutation: UPDATE_SKILL,
      //   variables: {
      //     input: payload
      //   }
      // });

      if (errors?.length) {
        throw errors.map(e => e.message);
      }
      return;
    } catch (err) {
      logger.error("Failed to update Closed message in UMSkill storage", err);
      throw err;
    }
  } catch(err) {
    logger.error("Failed to update Closed message in Shared Admin storage", err);
    throw err;
  }
};