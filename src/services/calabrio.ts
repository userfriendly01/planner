import { apiPaths }from "globals";
import { myAxios } from "utils";

export const getCalabrioOrg = async (): Promise<any[]> => {
  return await myAxios.get(apiPaths.GET_CALABRIO_ORG);
};