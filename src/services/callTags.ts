import { apiPaths } from "globals";
import { myAxios } from "utils";

export const getCallTags = (): Promise<any[]> => myAxios.get(apiPaths.GET_CALL_TAGS);
export const getCallTagOptions = (): Promise<any[]> => myAxios.get(apiPaths.GET_CALL_TAGS_OPTIONS);
