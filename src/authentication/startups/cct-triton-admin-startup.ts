import { getStartupProfiles } from "authentication";
import {
  DBList,
  LIST_USERS,
  UMUser,
  apiPaths
} from "globals";
import {
  getManagers as getManagersServiceCall,
  getOffices as getOfficesServiceCall,
  getWfmBusinessUnits,
  getCalabrioUsers as getCalabrioUsersServiceCall,
  getCalabrioRoles as getCalabrioRolesServiceCall,
  getCalabrioOrg as getCalabrioOrgServiceCall
} from "services";
import {
  formatManagersResponse,
  formatOfficesResponse,
  getCalabrioWfmOptions,
  logger,
  mapWorkerFromDbWorker,
  myAxios
} from "utils";
import { apolloClient } from "components";

const getManagers = async (dispatch: any) => {
  try {
    const managers = await getManagersServiceCall();
    dispatch({
      type: "loadManagers",
      payload: formatManagersResponse(managers)
    });
  } catch (error) {
    logger.error("Failed to fetch managers from service", { error });

    throw ({
      msg: "Failed to fetch managers from service",
      error
    });
  }
};

const getOffices = async (dispatch: any) => {
  try {
    const offices = await getOfficesServiceCall();
    dispatch({
      type: "loadOffices",
      payload: formatOfficesResponse(offices)
    });
  } catch (error) {
    logger.error("Failed to fetch offices from service", { error });

    throw ({
      msg: "Failed to fetch offices from service",
      error
    });
  }
};

const getCalabrioUsers = async (dispatch: any) => {
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
    //Additionally - there can be local issues we have to work out when trying to call this 
  }
};

const getCalabrioOrg = async (dispatch: any) => {
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
    //Additionally - there can be local issues we have to work out when trying to call this 
  }
};

const getCalabrioRoles = async (dispatch: any) => {
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
    //Additionally - there can be local issues we have to work out when trying to call this 
  }
};

const getProfiles = (dispatch: any) => new Promise((resolve, reject) => myAxios.get(apiPaths.PROFILES)
  .then(res => {
    dispatch({
      type: "loadProfiles",
      payload: res.data
    });
    resolve(true);
  })
  .catch(error => {
    logger.error("Failed to fetch profiles from service", { error });

    reject({
      msg: "Failed to fetch profiles from service",
      error
    });
  })
);

export const getSkills = (dispatch: any) => new Promise((resolve, reject) => myAxios.get(apiPaths.GET_SKILLS)
  .then(res => {
    dispatch({
      type: "loadSkills",
      payload: res.data.consolidatedSkills
    });
    dispatch({
      type: "loadSkillGroups",
      payload: res.data.consolidatedSkills
    });
    resolve(true);
  })
  .catch(error => {
    logger.error("Failed to fetch skills from service", { error });

    reject({
      msg: "Failed to fetch skills from service",
      error
    });
  })
);

const getUsers = async (dispatch: any) => {
  let nextToken = "start";

  const firstQuery = new Promise(resolve => {
    const getAllUsers = async () => {
      while (nextToken) {
        const isFirstQuery = nextToken === "start";

        const {
          data, error
        } = await apolloClient.query<{ users: DBList<UMUser> }>({
          query: LIST_USERS,
          variables: {
            nextToken: isFirstQuery ? null : nextToken
          }
        });

        if (error) {
          logger.error("Failed to fetch workers from service", { error });

          throw ({
            msg: "Failed to fetch workers from service",
            error
          });
        }

        const newUsers = [] as UMUser[];
        data.users.items.forEach(user => {
          if (!user.inactiveDate && user.twilio_attributes_raw) {
            newUsers.push(mapWorkerFromDbWorker(user));
          }
        });

        dispatch(({
          type: "addWorkers",
          payload: newUsers
        }));

        if(isFirstQuery){
          resolve(newUsers);
        }

        ({ nextToken } = data.users);
      }
    };

    getAllUsers();
  });

  return firstQuery;
};

const getBusinessUnits = async (dispatch: any) => {
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

    throw ({
      msg: "Failed to fetch Calabrio Business Units",
      error
    });
  }
};

export const runTritonAdminStartup = (dispatch: any) => {
  /* Please add new service calls to the end of this Promise.all,
  the existing order is important */

  return Promise.all([
    Promise.resolve(getStartupProfiles().TRITON.name),
    getUsers(dispatch),
    getManagers(dispatch),
    getOffices(dispatch),
    getProfiles(dispatch),
    getSkills(dispatch),
    getCalabrioUsers(dispatch),
    getCalabrioOrg(dispatch),
    getCalabrioRoles(dispatch),
    getBusinessUnits(dispatch),
    getCalabrioWfmOptions(dispatch)
  ]);
};