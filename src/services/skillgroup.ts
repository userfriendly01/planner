import { apiPaths } from "globals";
import { myAxios } from "utils";

// requestBody should contain skill_group_nme and array of skillIds
export const addSkillGroup = (requestBody: any): Promise<any> => // todo: make a type
  myAxios.post(apiPaths.SKILL_GROUPS, requestBody).then(response => response.data);

export const deleteSkillGroup = (skillGroupId: string | number): Promise<any> =>
  myAxios.delete(`${apiPaths.SKILL_GROUPS}/${skillGroupId}`).then(response => response.data);

// edit the name of an existing skillgroup
export const updateSkillGroup = (skillGroupId: number, requestBody: any): Promise<any> =>
  myAxios.put(`${apiPaths.SKILL_GROUPS}/${skillGroupId}`, requestBody).then(response => response.data);
