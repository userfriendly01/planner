import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";

export const terminateUser = (payload: any) => myAxios.post(apiPaths.TERMINATE_WORKER, payload);