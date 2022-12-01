import { myAxios } from "utils";
import { apiPaths } from "globals";

export interface DbWorkerTaskInfoResponse {
  profile_id: number;  
  wrkr_tsk_info_id: number;
  display_nme: string;
  options_id: number;
}

export const getWorkerTaskInfo = (): Promise<DbWorkerTaskInfoResponse[]> =>
  myAxios.get(apiPaths.GET_PROFILE_WORKER_TASK_INFO).then(response => response.data);
