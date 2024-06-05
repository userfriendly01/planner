import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";

export const terminateUser = payload => myAxios.post(apiPaths.TERMINATE_WORKER, payload);