import { apiPaths } from "globals";
import { myAxios } from "utils";


export const getTimeOfDays = (): Promise<any> =>
  myAxios.get(apiPaths.GET_TIME_OF_DAYS).then(response => response.data);