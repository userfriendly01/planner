import {
  AddEditSkillGroupBody
} from "callflowmanagement/SkillManagement/Skills.Interfaces";
import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";

// requestBody should contain skill_group_nme and array of skillIds
export const addSkillGroup = (requestBody: AddEditSkillGroupBody): Promise<any> =>
  myAxios.post(apiPaths.SKILL_GROUPS, requestBody).then(response => response.data);

export const deleteSkillGroup = (skillGroupId: string | number): Promise<any> =>
  myAxios.delete(`${apiPaths.SKILL_GROUPS}/${skillGroupId}`).then(response => response.data);

// edit the name of an existing skillgroup, and/or the skillIds it is associated with
export const updateSkillGroup = (skillGroupId: number, requestBody: AddEditSkillGroupBody): Promise<any> =>
  myAxios.put(`${apiPaths.SKILL_GROUPS}/${skillGroupId}`, requestBody).then(response => response.data);
