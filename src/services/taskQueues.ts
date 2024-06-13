import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";

export const getTaskQueues = (): Promise<any> =>
  myAxios.get(apiPaths.GET_TASK_QUEUES).then(response => response.data);