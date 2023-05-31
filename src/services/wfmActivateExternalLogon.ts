import { apiPaths }from "globals";
import { myAxios } from "utils";

export const wfmActivateExternalLogon = async (payload: any): Promise<any> => {
  return Promise.resolve();
  // return await myAxios.post(apiPaths.WFM_ACTIVATE_EXTERNAL_LOGON, payload);
};