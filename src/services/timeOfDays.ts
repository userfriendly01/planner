import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";

export const getTimeOfDays = (): Promise<any> =>
  myAxios.get(apiPaths.GET_TIME_OF_DAYS).then(response => response.data);