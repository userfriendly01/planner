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
import { UMSkill } from "../globals/interfaces";

export interface UpdateMessageRequestBody {
  skillName: string;
  message: string;
  nNumber: string;
}

const updateSharedGraph = async (skill_id: string, input: UMSkill) => {
  console.log("wsx updateSharedGraph():", skill_id, input);
  const { errors }  = await apolloClient.mutate<{ skill: UMSkill}>({
    mutation: UPDATE_SKILL,
    variables: {
      skill_id,
      input
    }
  });

  if (errors?.length) {
    throw errors.map(e => e.message);
  }
  return;
};

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

    try { // flash_message custom_closed_message
      await updateSharedGraph(payload.skillName, { flash_message: payload.message });
      dispatch({
        type: skillActions.UPDATE_SKILL,
        payload: {
          skillName: payload.skillName,
          changes: {
            flashMessage: payload.message
          }
        }
      });
      console.log("wsx Successfully updated flash_message");
      return;
    } catch (err) {
      logger.error("Failed to update Flash message on UMSkill", err);
      throw err;
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
  try {
    console.log("wsx payload.message:", payload.message);
    await myAxios.put(apiPaths.CLOSED_MESSAGE, req, config);

    try { // flash_message custom_closed_message
      await updateSharedGraph(payload.skillName, { custom_closed_message: payload.message });
      dispatch({
        type: skillActions.UPDATE_SKILL,
        payload: {
          skillName: payload.skillName,
          changes: {
            closedMessage: payload.message
          }
        }
      });
      console.log("wsx Successfully updated custom_closed_message");
      return;
    } catch (err) {
      logger.error("Failed to update Closed message on UMSkill", err);
      throw err;
    }

  } catch(err) {
    logger.error("Failed to update Closed message in Shared Admin storage", err);
    throw err;
  }
};