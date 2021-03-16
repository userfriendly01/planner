import { apiPaths }from "globals";
import { myAxios } from "utils";

// Worker object directly from cicct-twilio-worker-api response
export interface DbWorker {
  attributes: {
    [key: string]: any,
  },
  directDialNum: string,
  workerSid: string
}

export const createUser = (worker: Partial<DbWorker>): Promise<DbWorker> =>
  myAxios.post(apiPaths.CREATE_WORKER, worker)
    .then(response => response.data);
