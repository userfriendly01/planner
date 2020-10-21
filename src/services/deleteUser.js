import { apiPaths }from "globals";
import { myAxios } from "utils";

export const deleteUser = workerSid => myAxios.delete(apiPaths.DELETE_WORKER(workerSid));;