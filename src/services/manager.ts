import { apiPaths }from "globals";
import { myAxios } from "utils";


export interface DbAddManagerRequest {
  manager_first_nme: string;
  manager_last_nme: string;
  manager_n_num: string;
  profile_id: number;
  calabrio_team_ids: string;
}

export interface DbUpdateManagerRequest {
  manager_first_nme?: string;
  manager_last_nme?: string;
  manager_n_num?: string;
  profile_id?: number;
  calabrio_team_ids?: string;
}

export interface DbManagerResponse {
  manager_first_nme: string;
  manager_last_nme: string;
  manager_n_num: string;
  manager_id: number;
  profile_id: number;
  calabrio_team_ids: string;
}

export const addManager = (manager: DbAddManagerRequest): Promise<any> =>
  myAxios.post(apiPaths.MANAGERS, manager).then(response => response.data);

export const updateManager = (managerId: number, payload: DbUpdateManagerRequest): Promise<any> =>
  myAxios.put(`${apiPaths.MANAGERS}/${managerId}`, payload).then(response => response.data);

export const getManagers = (): Promise<DbManagerResponse[]> =>
  myAxios.get(apiPaths.MANAGERS).then(response => response.data);