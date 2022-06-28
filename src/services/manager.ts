import { apiPaths }from "globals";
import { myAxios } from "utils";


export interface DbManagerRequest {
  manager_first_nme: string;
  manager_last_nme: string;
  manager_n_num: string;
  profile_id: number;
  calabrio_team_ids: string
}

export interface DbManagerResponse {
  manager_first_nme: string;
  manager_last_nme: string;
  manager_n_num: string;
  manager_id: number;
  profile_id: number;
  calabrio_team_ids: string
}

export const addManager = (manager: DbManagerRequest): Promise<any> => {
  console.log("Add Manager Payload: ", manager);
  return myAxios.post(apiPaths.MANAGERS, manager).then(response => response.data);
};

export const editManager = (managerId: number, manager: DbManagerRequest): Promise<any> => {
  console.log("Edit Manager Payload: ", manager);
  return myAxios.put(`apiPaths.MANAGERS/${managerId}`, manager).then(response => response.data);
};

export const getManagers = (): Promise<DbManagerRequest[]> =>
  myAxios.get(apiPaths.MANAGERS).then(response => response.data);