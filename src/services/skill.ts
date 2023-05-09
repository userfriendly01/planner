import { apiPaths } from "globals";
import { myAxios } from "utils";
import { AddEditSkill } from "../components/tabs/callflowmanagement/SkillManagement/Skills.Interfaces";


export const createSkill = (payload: AddEditSkill): Promise<any> =>
  myAxios.post(apiPaths.CREATE_SKILL, payload).then(response => response);