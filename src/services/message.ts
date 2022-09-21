import { apiPaths } from "globals";
import { myAxios } from "utils";

export const updateFlashMessage = (skill: any, message: string, nNumber: string) => {
  const req = {
    skill: skill.name,
    flashMessage: message,
    updatedBy: nNumber
  };
  myAxios.post(apiPaths.FLASH_MESSAGE, req);
};

export const updateClosedMessage = (skill: any, message: string, nNumber: string) => {
  const req = {
    skill: skill.name,
    closedMessage: message,
    updatedBy: nNumber
  };
  return myAxios.post(apiPaths.CLOSED_MESSAGE, req);
};