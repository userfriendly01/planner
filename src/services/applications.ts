import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";


export const getApplications = (): Promise<any> =>
  myAxios.get(apiPaths.GET_APPLICATIONS).then(response => response.data);