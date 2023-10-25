import { AxiosResponse } from "axios";
import { apiPaths } from "globals";
import { myAxios } from "utils";

export const fetchResetProfileDatadogLogs = async (nNumber: string): Promise<AxiosResponse> => {
  return await myAxios.get(apiPaths.GET_RESET_PROFILE_DATADOG_LOGS(nNumber));
};

export const resetProfiles = async (nNumber: string, body: any): Promise<AxiosResponse> => {
  return await myAxios.post(apiPaths.RESET_PROFILES(nNumber), body);
};