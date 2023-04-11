import { apiPaths }from "globals";
import { myAxios } from "utils";

// todo: double check api path is correct
export const wfmActivateExternalLogon = async (payload: any): Promise<any> => {
  console.log("wfmActivateExternalLogon calling the softphone service NYOW", payload.workerNNumbers.length);
  return Promise.resolve("TESTING WORKED ??");
  // return await myAxios.post(apiPaths.WFM_ACTIVATE_EXTERNAL_LOGON, payload);
};