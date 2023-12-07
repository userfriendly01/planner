import { apiPaths } from "globals";
import { myAxios } from "utils";

export const terminateUser = payload => myAxios.post(apiPaths.TERMINATE_WORKER, payload);