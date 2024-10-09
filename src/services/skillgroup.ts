import { SkillGroup } from "callflowmanagement/SkillManagement/Skills.Interfaces";
import { apolloClient } from "../components/core/Auth/SharedGraphAPIProvider";
import {
  CREATE_SKILL_GROUP, DELETE_SKILL_GROUP, UPDATE_SKILL_GROUP
} from "globals/skillGroup";
import { Action } from "globals/interfaces";
import { skillActions } from "context/reducers/skillReducer";
import { logger } from "utils/logger";


interface AddSkillGroupBody {
  skill_group_name: string,
  skill_ids?: string[]
}

export const createSkillGroup = async (payload: AddSkillGroupBody, dispatch: (action: Action) => void): Promise<any> => {
  try {
    const {
      errors, data
    }  = await apolloClient.mutate<{ skillGroup: { keys: { pk: string, sk: string}[]} }>({
      mutation: CREATE_SKILL_GROUP,
      variables: {
        input: payload
      }
    });

    if (errors?.length) {
      throw errors.map(e => e.message);
    }

    const graphSkillGroup = data.skillGroup.keys.find((k => k.pk === k.sk));
    const graphSkillGroupId = graphSkillGroup.pk.split("#");
    dispatch({
      type: skillActions.ADD_SKILL_GROUP,
      payload: {
        skill_group_name: payload.skill_group_name,
        skills: payload.skill_ids,
        id: graphSkillGroupId[1],
        pk: graphSkillGroup.pk,
        sk: graphSkillGroup.sk
      }
    });

    return data?.skillGroup;

  } catch(err){
    logger.error("createSkillGroup - Error thrown", err);
    throw err;
  }
};

export interface UpdateSkillGroupBody {
  skill_group_name: string,
  skill_ids?: string[]
}

export const updateSkillGroup = async (id: string, payload: UpdateSkillGroupBody, dispatch: (action: Action) => void): Promise<any> => {
  try {
    const {
      errors, data
    }  = await apolloClient.mutate<{ skillGroup: { keys: { pk: string, sk: string}[]} }>({
      mutation: UPDATE_SKILL_GROUP,
      variables: {
        id,
        input: payload
      }
    });

    if (errors?.length) {
      throw errors.map(e => e.message);
    }


    const graphSkillGroup = data.skillGroup.keys.find((k => k.pk === k.sk));
    const graphSkillGroupId = graphSkillGroup.pk.split("#");

    dispatch({
      type: skillActions.UPDATE_SKILL_GROUP,
      payload: {
        skillGroup: {
          skill_group_name: payload.skill_group_name,
          skills: payload.skill_ids,
          id: graphSkillGroupId[1],
          pk: graphSkillGroup.pk,
          sk: graphSkillGroup.sk
        },
        id
      }
    });

    return data?.skillGroup;

  } catch(err){
    logger.error("updateSkillGroup - Error thrown", err);
    throw err;
  }
};

export const deleteSkillGroup = async (id: string, dispatch: (action: Action) => void): Promise<any> => {
  try {
    const {
      errors, data
    }  = await apolloClient.mutate<{ skillGroup: SkillGroup }>({
      mutation: DELETE_SKILL_GROUP,
      variables: {
        id
      }
    });

    if (errors?.length) {
      throw errors;
    }

    dispatch({
      type: skillActions.DELETE_SKILL_GROUP,
      payload: id
    });

    return data?.skillGroup;

  } catch(err){
    logger.error("deleteSkillGroup - Error thrown", err);
    throw err;
  }
};