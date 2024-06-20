import { apiPaths } from "globals";
import { Skill } from "globals/interfaces";
import { AxiosResponse } from "axios";
import { escapeQuotes } from "utils";
import { myAxios } from "utils/myAxios";

export const updateFlashMessage = (skill: Skill, message: string, nNumber: string): Promise<AxiosResponse<any>> => {
  const req = {
    skill: skill.name,
    flashMessage: escapeQuotes(message),
    updatedBy: nNumber
  };
  return myAxios.post(apiPaths.FLASH_MESSAGE, req);
};

export const updateClosedMessage = (skill: Skill, message: string, nNumber: string): Promise<AxiosResponse<any>> => {
  const req = {
    skill: skill.name,
    closedMessage: escapeQuotes(message),
    updatedBy: nNumber
  };
  return myAxios.post(apiPaths.CLOSED_MESSAGE, req);
};