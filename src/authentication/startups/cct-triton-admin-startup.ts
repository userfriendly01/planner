import { getStartupProfiles } from "authentication/authenticationProfiles";
import { Action } from "globals/interfaces";
import {
  getWfmBusinessUnits,
  getCalabrioUsers as getCalabrioUsersServiceCall,
  getCalabrioRoles as getCalabrioRolesServiceCall,
  getCalabrioOrg as getCalabrioOrgServiceCall
} from "services/calabrio";
import { listUMManagers } from "services/manager";
import { listUMUsers } from "services/user";
import { listUMSoftphoneConfigs } from "services/profile";
import { loadConsolidatedSkills } from "services/skill";
import { getCalabrioWfmOptions } from "utils/calabrioUtils";
import { logger } from "utils/logger";

const getCalabrioUsers = async (dispatch: (action: Action) => void) => {
  try {
    const users: any = await getCalabrioUsersServiceCall();
    logger.log("Calabrio Users", users);
    dispatch({
      type: "loadCalabrioUsers",
      payload: users.data
    });
  } catch (error) {
    logger.error("Failed to fetch Calabrio Users from service", { error });
    //We're not throwing an error here so that we can still load Triton Admin and use its other features if this fails
  }
};

const getCalabrioOrg = async (dispatch: (action: Action) => void) => {
  try {
    const org: any = await getCalabrioOrgServiceCall();
    logger.log("Calabrio Org", org);
    dispatch({
      type: "loadCalabrioOrg",
      payload: org.data
    });
  } catch (error) {
    logger.error("Failed to fetch Calabrio org from service", { error });
    //We're not throwing an error here so that we can still load Triton Admin and use its other features if this fails
  }
};

const getCalabrioRoles = async (dispatch: (action: Action) => void) => {
  try {
    const roles: any = await getCalabrioRolesServiceCall();
    logger.log("Calabrio Roles", roles);
    dispatch({
      type: "loadCalabrioRoles",
      payload: roles.data
    });
  } catch (error) {
    logger.error("Failed to fetch Calabrio Roles from service", { error });
    //We're not throwing an error here so that we can still load Triton Admin and use its other features if this fails
  }
};

const getBusinessUnits = async (dispatch: (action: Action) => void) => {
  try {
    const response: any = await getWfmBusinessUnits();
    dispatch({
      type: "loadWfmOrg",
      payload: {
        org: response.data.BusinessUnits || [],
        People_Without_Team: response.data.People_Without_Team || [],
        errors: response.data.Errors || []
      }
    });
    return response.data;
  } catch (error) {
    logger.error("Failed to fetch Calabrio Business Units", { error });
    //We're not throwing an error here so that we can still load Triton Admin and use its other features if this fails
  }
};

export const runTritonAdminStartup = (dispatch:  (action: Action) => void, skillDispatch:  (action: Action) => void): Promise<any[]> => {
  /* Please add new service calls to the end of this Promise.all,
  the existing order is important */

  listUMUsers(dispatch); // We want to kick these off but not wait for the results
  getBusinessUnits(dispatch);
  getCalabrioWfmOptions(dispatch);

  return Promise.all([
    Promise.resolve(getStartupProfiles().TRITON.name),
    listUMManagers(dispatch),
    listUMSoftphoneConfigs(dispatch),
    loadConsolidatedSkills(skillDispatch),
    getCalabrioUsers(dispatch),
    getCalabrioOrg(dispatch),
    getCalabrioRoles(dispatch)
  ]);
};