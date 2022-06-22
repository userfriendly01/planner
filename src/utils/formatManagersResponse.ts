import { Manager } from "globals";
import { DbManagerResponse } from "services";

const parseCalabrioTeams = (manager: DbManagerResponse): any => {
  try {
    return JSON.parse(manager.calabrio_team_ids);
  } catch(err) {
    console.error("Error parsing Calabrio Teams for Manager Id", manager.manager_id);
    return [];
  }
};

export const formatManagersResponse = (response: DbManagerResponse[]): Manager[] => {
  if (response) {
    return response.map<Manager>(manager => {
      return {
        manager_first_name: manager.manager_first_nme,
        manager_last_name: manager.manager_last_nme,
        manager_n_number: manager.manager_n_num,
        manager_id: manager.manager_id,
        profile_id: manager.profile_id,
        calabrio_team_ids: parseCalabrioTeams(manager)
      };
    });
  } else {
    return [];
  }
};