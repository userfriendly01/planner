import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";
import { AddEditSkill } from "callflowmanagement/SkillManagement/Skills.Interfaces";

export const createSkill = (payload: AddEditSkill): Promise<any> =>
  myAxios.post(apiPaths.CREATE_SKILL, payload).then(response => response);