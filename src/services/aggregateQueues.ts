import { apiPaths } from "globals";
import { myAxios } from "utils";

export const getAggregateQueuesType = (type: string): Promise<any[]> => myAxios.get(apiPaths.GET_AGGREGATE_QUEUES_TYPE(type)).then(response => response.data);
