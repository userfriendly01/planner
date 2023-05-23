import { apiPaths } from "globals";
import { myAxios } from "utils";


export const addSkillGroup = (skillGroupName: string): Promise<any> =>
  myAxios.post(apiPaths.SKILL_GROUPS, { skill_group_nme: skillGroupName }).then(response => response.data);

export const addSkillGroupsSkill = (skillGroupId: string | number, skillId: string | number): Promise<any> =>
  myAxios.post(`${apiPaths.SKILL_GROUPS}/${skillGroupId}/skills`, {
    skill_id: skillId
  }).then(response => response.data);

export const deleteSkillGroup = (skillGroupId: string | number): Promise<any> =>
  myAxios.delete(`${apiPaths.SKILL_GROUPS}/${skillGroupId}`).then(response => response.data);

// edit the name of an existing skillgroup
export const updateSkillGroup = (skillGroupId: number, requestBody: any): Promise<any> =>
  myAxios.put(`${apiPaths.SKILL_GROUPS}/${skillGroupId}`, requestBody).then(response => response.data);
