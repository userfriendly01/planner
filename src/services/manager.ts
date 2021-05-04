import { apiPaths }from "globals";
import { myAxios } from "utils";

export interface DbManager {
  manager_first_nme: string;
  manager_last_nme: string;
  manager_n_num: string;
}

export const addManager = (manager: DbManager): Promise<any> =>
  myAxios.post(apiPaths.MANAGERS, manager).then(response => response.data);

export const getManagers = (): Promise<DbManager[]> =>
  myAxios.get(apiPaths.MANAGERS).then(response => response.data);