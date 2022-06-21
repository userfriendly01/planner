import { Manager } from "globals";
import { DbManagerResponse } from "services";

export const formatManagersResponse = (response: DbManagerResponse[]): Manager[] => {
  if (response) {
    return response.map<Manager>(manager => {
      console.log("**Type of Manager's Calabrio Teams", typeof manager.calabrio_team_ids);
      return {
        manager_first_name: manager.manager_first_nme,
        manager_last_name: manager.manager_last_nme,
        manager_n_number: manager.manager_n_num,
        manager_id: manager.manager_id,
        profile_id: manager.profile_id,
        calabrio_team_ids: manager.calabrio_team_ids
      };
    });
  } else {
    return [];
  }
};