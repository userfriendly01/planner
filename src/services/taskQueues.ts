import { apiPaths } from "globals";
import { TwilioQueue } from "callflowmanagement/Skills.Interfaces";
import { myAxios } from "utils/myAxios";

export const getTaskQueues = (): Promise<any> =>
  myAxios.get(apiPaths.TASK_QUEUES);

export const createTaskQueue = (taskQueue: TwilioQueue): Promise<any> =>
  myAxios.post(apiPaths.TASK_QUEUES, taskQueue);

export const updateTaskQueue = (taskQueueSid: string, updatedTaskQueue: Partial<TwilioQueue>): Promise<any> =>
  myAxios.put(`${apiPaths.TASK_QUEUES}/${taskQueueSid}`, updatedTaskQueue);

export const deleteTaskQueue = (taskQueueSid: string): Promise<any> =>
  myAxios.delete(`${apiPaths.TASK_QUEUES}/${taskQueueSid}`);