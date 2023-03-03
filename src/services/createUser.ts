import { apiPaths }from "globals";
import {
  DbWorker,
  myAxios
} from "utils";

export const createUser = (worker: Partial<DbWorker>): Promise<DbWorker> =>
  myAxios.post(apiPaths.CREATE_WORKER, worker)
    .then(response => response.data);