import { apiPaths }from "globals";
import { myAxios } from "utils";

export const deleteUser = worker => myAxios.delete(apiPaths.DELETE_WORKER(worker.sid), { data: worker });