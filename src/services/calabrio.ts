import { apiPaths } from "globals";
import {
  CalabrioGroup,
  CalabrioUser
} from "usermanagement/CallRecording.Interfaces";
import { myAxios } from "utils/myAxios";

export const createCalabrioTeam = async (accessToken: string, payload: any): Promise<CalabrioGroup[]> => {
  return await myAxios.post(apiPaths.CREATE_CALABRIO_TEAM, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const createCalabrioUser = async (accessToken: string, payload: any): Promise<CalabrioGroup[]> => {
  return await myAxios.post(apiPaths.CREATE_CALABRIO_USER, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const updateCalabrioUser = async (personId: number, payload: any): Promise<CalabrioUser> => {
  return await myAxios.put(apiPaths.UPDATE_CALABRIO_USER(personId), payload);
};

export const getWfmOrg = async (businessUnitId: string): Promise<CalabrioGroup[]> => {
  const startDate = new Date().toISOString().split("T")[0];
  const endDate = new Date().toISOString().split("T")[0];
  return await myAxios.get(`${apiPaths.GET_CALABRIO_WFM_ORG}/${businessUnitId}/${startDate}/${endDate}`);
};

export const getWfmOptions = async (): Promise<CalabrioGroup[]> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_WFM_OPTIONS);
};

export const getWfmTeam = async (BusinessUnitId: string, TeamId: string): Promise<any> => {
  return await myAxios.get(`${apiPaths.GET_CALABRIO_WFM}`, {
    params: {
      api: "Team",
      BusinessUnitId,
      TeamId
    }
  });
};

export const getWfmUserByNNumber = async (nNumber: string): Promise<{
  data: {
    Result: [CalabrioUser] | []
  }
}> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_WFM_USER_BY_NNUMBER(nNumber.toLowerCase()));
};

export const getWfmBusinessUnits = async (): Promise<CalabrioGroup[]> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_WFM, {
    params: {
      api: "Business Units"
    }
  });
};

export const createCalabrioWFMPerson = async (payload: any): Promise<any> => {
  return await myAxios.post(apiPaths.CREATE_CALABRIO_WFM_PERSON, payload);
};

export const getCalabrioUsers = async (): Promise<any[]> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_USERS);
};

export const getCalabrioOrg = async (): Promise<any[]> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_ORG);
};

export const getCalabrioRoles = async (): Promise<CalabrioGroup[]> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_ROLES);
};

export const getCalabrioUser = async (personId: number): Promise<any> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_USER(personId));
};

export const getQmUserProfiles = async (workerSid: string, nNumber: string, email: string, firstName?: string, lastName?: string): Promise<CalabrioUser> => {
  let url = `${apiPaths.GET_CALABRIO_USER_PROFILES}/${workerSid}/${nNumber}/${email}`;

  if (firstName && lastName) {
    url = url + `/${firstName}/${lastName}`;
  }

  return await myAxios.get(url);
};
