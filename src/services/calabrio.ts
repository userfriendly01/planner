import { apiPaths }from "globals";
import { CalabrioGroup } from "../components/usermanagement/CallRecording/CallRecording.Interfaces";
import { myAxios } from "utils";


export const createCalabrioUser = async (payload: any): Promise<CalabrioGroup[]> => {
  return await myAxios.post(apiPaths.CREATE_CALABRIO_USER, payload);
};

export const getCalabrioOrg = async (): Promise<CalabrioGroup[]> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_ORG);
};

export const getCalabrioRoles = async (tenantId: number): Promise<CalabrioGroup[]> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_ROLES(tenantId));
};

export const getCalabrioUser = async (personId: number): Promise<CalabrioGroup[]> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_USER(personId));
};