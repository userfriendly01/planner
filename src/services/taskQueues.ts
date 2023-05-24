import { apiPaths } from "globals";
import { myAxios } from "utils";


export const getTaskQueues = (): Promise<any> =>
  myAxios.get(apiPaths.GET_TASK_QUEUES).then(response => response.data);