import { AxiosResponse } from "axios";
import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";

export const fetchResetProfileDatadogLogs = async (accessToken: string, nNumber: string): Promise<AxiosResponse> => {
  return await myAxios.get(apiPaths.RESET_PROFILES(nNumber), {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const resetProfiles = async (accessToken: string, nNumber: string, body: any): Promise<AxiosResponse> => {
  return await myAxios.post(apiPaths.RESET_PROFILES(nNumber), body, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};