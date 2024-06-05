import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";

export const getAccessGroup = (): Promise<any[]> => myAxios.get(apiPaths.GET_ACCESS_GROUP).then(response => response.data);
