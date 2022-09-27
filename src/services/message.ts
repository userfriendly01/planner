import {
  apiPaths,
  Skill
} from "globals";
import { AxiosResponse } from "axios";
import { myAxios } from "utils";

export const updateFlashMessage = (skill: Skill, message: string, nNumber: string): Promise<AxiosResponse<any>> => {
  const req = {
    skill: skill.name,
    flashMessage: message,
    updatedBy: nNumber
  };
  return myAxios.post(apiPaths.FLASH_MESSAGE, req);
};

export const updateClosedMessage = (skill: Skill, message: string, nNumber: string): Promise<AxiosResponse<any>> => {
  const req = {
    skill: skill.name,
    closedMessage: message,
    updatedBy: nNumber
  };
  return myAxios.post(apiPaths.CLOSED_MESSAGE, req);
};