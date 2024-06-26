import {
  AddEditSkillGroupBody,
  SkillGroup
} from "callflowmanagement/SkillManagement/Skills.Interfaces";
import { apolloClient } from "../components/core/Auth/SharedGraphAPIProvider";
import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";
import {
  CREATE_SKILL_GROUP, UPDATE_SKILL_GROUP
} from "globals/graphql";

export const addSkillGroup = async (requestBody: AddEditSkillGroupBody): Promise<any> => {
  const {
    errors, data
  }  = await apolloClient.mutate<{ skillGroup: SkillGroup }>({
    mutation: CREATE_SKILL_GROUP,
    variables: {
      input: requestBody
    }
  });

  if (errors?.length) {
    throw errors;
  }

  return data?.skillGroup;
};

export const deleteSkillGroup = (skillGroupId: string | number): Promise<any> =>
  myAxios.delete(`${apiPaths.SKILL_GROUPS}/${skillGroupId}`).then(response => response.data);

export const updateSkillGroup = async (id: string, requestBody: AddEditSkillGroupBody): Promise<any> => {
  const {
    errors, data
  }  = await apolloClient.mutate<{ skillGroup: SkillGroup }>({
    mutation: UPDATE_SKILL_GROUP,
    variables: {
      id,
      input: requestBody
    }
  });

  if (errors?.length) {
    throw errors;
  }

  return data?.skillGroup;
};