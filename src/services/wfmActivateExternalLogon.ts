import { apiPaths }from "globals";
import { myAxios } from "utils";

// todo: double check api path is correct
export const wfmActivateExternalLogon = async (payload: any): Promise<any> => {
  return await myAxios.post(apiPaths.WFM_ACTIVATE_EXTERNAL_LOGON, payload);
};