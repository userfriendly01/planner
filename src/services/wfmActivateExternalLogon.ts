import { apiPaths }from "globals";
import { myAxios } from "utils";

export const wfmActivateExternalLogon = async (payload: any): Promise<any> => {
  console.log("wfmActivateExternalLogon calling the softphone service NYOW", payload.workerNNumbers.length); // todo: remove
  return await myAxios.post(apiPaths.WFM_ACTIVATE_EXTERNAL_LOGON, payload);
};