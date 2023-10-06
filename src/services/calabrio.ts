import { apiPaths } from "globals";
import {
  CalabrioGroup,
  CalabrioUser
} from "../components/tabs/usermanagement/OnboardNewUser/CallRecording/CallRecording.Interfaces";
import { myAxios } from "utils";

export const createCalabrioTeam = async (payload: any): Promise<CalabrioGroup[]> => {
  return await myAxios.post(apiPaths.CREATE_CALABRIO_TEAM, payload);
};

export const createCalabrioUser = async (payload: any): Promise<CalabrioGroup[]> => {
  return await myAxios.post(apiPaths.CREATE_CALABRIO_USER, payload);
};

export const updateCalabrioUser = async (personId: number, payload: any): Promise<CalabrioUser> => {
  return await myAxios.put(apiPaths.UPDATE_CALABRIO_USER(personId), payload);
};

export const getWfmOrg = async (businessUnitId: string): Promise<CalabrioGroup[]> => {
  const startDate = new Date().toISOString().split('T')[0];
  const endDate = new Date().toISOString().split('T')[0];
  return await myAxios.get(`${apiPaths.GET_CALABRIO_WFM_ORG}/${businessUnitId}/${startDate}/${endDate}`);
};

export const getWfmOptions = async (): Promise<CalabrioGroup[]> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_WFM_OPTIONS);
};

export const getWfmUserByNNumber = async (nNumber: string): Promise<CalabrioUser> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_WFM_USER_BY_NNUMBER(nNumber));
};

export const getWfmBusinessUnits = async (): Promise<CalabrioGroup[]> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_WFM_BUS);
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
    url = url + `/${firstName}/${lastName}`
  }

  return await myAxios.get(url);
};
