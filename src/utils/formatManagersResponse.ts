import { Manager } from "context";
import { DbManager } from "services";

export const formatManagersResponse = (response: DbManager[]): Manager[] => {
  if (response) {
    return response.map<Manager>(manager => {
      return {
        manager_first_name: manager.manager_first_nme,
        manager_last_name: manager.manager_last_nme,
        manager_n_number: manager.manager_n_num
      };
    });
  } else {
    return [];
  }
};