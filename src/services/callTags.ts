import { apiPaths } from "globals";
import { myAxios } from "utils";

export const getCallTags = (): Promise<any[]> => myAxios.get(apiPaths.GET_CALL_TAGS).then(response => response.data);
export const getCallTagOptions = (): Promise<any[]> => myAxios.get(apiPaths.GET_CALL_TAGS_OPTIONS).then(response => response.data);
