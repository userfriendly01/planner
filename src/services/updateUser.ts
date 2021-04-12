import { apiPaths }from "globals";
import {
  DbWorker,
  myAxios
} from "utils";

export const updateUser = (workerSid: string, worker: Partial<DbWorker>): Promise<DbWorker> =>
  myAxios.post(apiPaths.UPDATE_WORKER(workerSid), worker)
    .then(response => response.data);
