import { apiPaths }from "globals";
import {
  CalabrioGroup,
  CalabrioUser
} from "../components/usermanagement/CallRecording/CallRecording.Interfaces";
import { myAxios } from "utils";


export const createCalabrioUser = async (payload: any): Promise<CalabrioGroup[]> => {
  return await myAxios.post(apiPaths.CREATE_CALABRIO_USER, payload);
};

export const updateCalabrioUser = async (personId: number, payload: any): Promise<CalabrioUser> => {
  return await myAxios.put(apiPaths.UPDATE_CALABRIO_USER(personId), payload);
};

export const getCalabrioAgents = async (): Promise<any[]> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_AGENTS);
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