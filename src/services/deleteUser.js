import { apiPaths }from "globals";
import { myAxios } from "utils";

// export const deleteUser = worker => myAxios.delete(apiPaths.DELETE_WORKER(worker.sid), { data: worker });
export const terminateWorker = payload => myAxios.post(apiPaths.TERMINATE_WORKER(payload.nNumber), payload); // TODO: make new file??