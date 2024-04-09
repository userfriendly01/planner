import {
  UMUser,
  apiPaths
}from "globals";
import { myAxios } from "utils";

export const updateUser = (workerSid: string, worker: Partial<UMUser>): Promise<UMUser> =>
  myAxios.post(apiPaths.UPDATE_WORKER(workerSid), worker)
    .then(response => response.data);
