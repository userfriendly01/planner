import { apiPaths }from "globals";
import { myAxios } from "utils";

export interface DbOffice {
  office_nme: string;
  office_num: string;
}

export const addOffice = (office: DbOffice): Promise<any> =>
  myAxios.post(apiPaths.OFFICES, office).then(response => response.data);

export const getOffices = (): Promise<DbOffice[]> =>
  myAxios.get(apiPaths.OFFICES).then(response => response.data);