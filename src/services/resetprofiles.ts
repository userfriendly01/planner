import { AxiosResponse } from "axios";
import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";

export const fetchResetProfileDatadogLogs = async (nNumber: string): Promise<AxiosResponse> => {
  return await myAxios.get(apiPaths.GET_RESET_PROFILE_DATADOG_LOGS(nNumber));
};

export const resetProfiles = async (accessToken: string, nNumber: string, body: any): Promise<AxiosResponse> => {
  return await myAxios.post(apiPaths.RESET_PROFILES(nNumber), body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    }
  });
};