import { apiPaths }from "globals";
import {
  DbWorker,
  myAxios
} from "utils";

export const createUser = (worker: Partial<DbWorker>): Promise<DbWorker> =>
  myAxios.post(apiPaths.CREATE_WORKER, worker)
    .then(response => response.data);


export const getJokes = (): Promise<any> =>
  myAxios.get(apiPaths.GET_JOKES)
    .then(response => response.data)
    .catch(err => console.error("Aww no jokes", err));