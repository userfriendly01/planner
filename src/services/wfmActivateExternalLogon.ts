import { apiPaths }from "globals";
import { myAxios } from "utils/myAxios";

export const wfmActivateExternalLogon = async (accessToken: string, payload: any): Promise<any> => {
  return await myAxios.post(apiPaths.WFM_ACTIVATE_EXTERNAL_LOGON, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    }
  });
};