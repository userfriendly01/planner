import { apiPaths }from "globals";
import { myAxios } from "utils";

export const terminateWorker = payload => myAxios.post(apiPaths.TERMINATE_WORKER(payload.nNumber), payload);