import { apiPaths }from "globals";
import {
  DbWorker,
  myAxios
} from "utils";

export const updateUser = (worker: Partial<DbWorker>): Promise<DbWorker> =>
  myAxios.post(apiPaths.UPDATE_WORKER, worker)
    .then(response => response.data);
