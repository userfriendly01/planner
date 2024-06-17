import { apiPaths } from "globals";
import { TwilioQueue } from "callflowmanagement/Skills.Interfaces";
import { myAxios } from "utils/myAxios";

export const getTaskQueues = (): Promise<any> =>
  myAxios.get(apiPaths.TASK_QUEUES).then(response => response.data);

export const createTaskQueue = (taskQueue: TwilioQueue): Promise<any> =>
  myAxios.post(apiPaths.TASK_QUEUES, taskQueue).then(response => response.data);

export const updateTaskQueue = (taskQueueSid: string, updatedTaskQueue: Partial<TwilioQueue>): Promise<any> =>
  myAxios.put(`${apiPaths.TASK_QUEUES}/${taskQueueSid}`, updatedTaskQueue).then(response => response.data);

export const deleteTaskQueue = (taskQueueSid: string): Promise<any> =>
  myAxios.delete(`${apiPaths.TASK_QUEUES}/${taskQueueSid}`).then(response => response.data);