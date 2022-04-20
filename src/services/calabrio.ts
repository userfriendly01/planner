import { apiPaths }from "globals";
import { CalabrioGroup } from "../components/usermanagement/CallRecording/CallRecording.Interfaces";
import { myAxios } from "utils";

export const getCalabrioOrg = async (): Promise<CalabrioGroup[]> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_ORG);
};

export const getCalabrioRoles = async (): Promise<CalabrioGroup[]> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_ROLES);
};

export const getCalabrioUser = async (personId: number): Promise<CalabrioGroup[]> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_USER(personId));
};