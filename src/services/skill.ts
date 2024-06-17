import { apiPaths } from "globals";
import { myAxios } from "utils/myAxios";
import { logger } from "utils/logger";
import { AddEditSkill } from "callflowmanagement/SkillManagement/Skills.Interfaces";
import { Action } from "globals/interfaces";

/* FYI - In the interest of not having to bother to set up the softphone-service to interact with the graph,
   The consolidation logic for skills will be here.

   In a future story, we want to move this logic to the shared-admin-service
   https://libertymutual.atlassian.net/browse/CCTP-13060
*/

export const createSkill = (payload: AddEditSkill): Promise<any> =>
  myAxios.post(apiPaths.CREATE_SKILL, payload).then(response => response);

const getTaskRouterSkillConfiguration = () => {
  console.log();
};

export const addTaskRouterSkills = () => {
  console.log();
};

export const removeTaskRouterSkills = () => {
  console.log();
};

export const editTaskRouterSkill = () => {
  console.log();
};

export const getConsolidatedSkills = async (dispatch: (action: Action) => void): Promise<boolean> => {
  /* TODO: Recreate the consolidated skills here between
      - Twilio Flex
      - CallFlow DB
      - Contact Manager (will replace with graph)

    Construct a differences array to log to datadog to audit for skill differences
  */


  // new Promise((resolve, reject) => myAxios.get(apiPaths.GET_SKILLS)
  //   .then(res => {
  //     dispatch({
  //       type: "loadSkills",
  //       payload: res.data.consolidatedSkills
  //     });
  //     dispatch({
  //       type: "loadSkillGroups",
  //       payload: res.data.consolidatedSkills
  //     });
  //     resolve(true);
  //   })
  //   .catch(error => {
  //     logger.error("Failed to fetch skills from service", { error });

  //     reject({
  //       msg: "Failed to fetch skills from service",
  //       error
  //     });
  //   })

  return false;
};