import { getStartupProfiles } from "authentication";
import { apiPaths } from "globals";
import {
  getManagers as getManagersServiceCall,
  getOffices as getOfficesServiceCall,
  getCalabrioUsers as getCalabrioUsersServiceCall,
  getCalabrioRoles as getCalabrioRolesServiceCall,
  getCalabrioOrg as getCalabrioOrgServiceCall
} from "services";
import {
  formatManagersResponse,
  formatOfficesResponse,
  formatWorkerResponse,
  myAxios
} from "utils";

const getManagers = async (dispatch: any) => {
  try {
    const managers = await getManagersServiceCall();
    dispatch({
      type: "loadManagers",
      payload: formatManagersResponse(managers)
    });
  } catch (error) {
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
    throw ({
      msg: "Failed to fetch offices from service",
      error
    });
  }
};

const getCalabrioUsers = async (dispatch: any) => {
  try {
    const agents: any = await getCalabrioUsersServiceCall();
    console.log("Calabrio Agents", agents.data);
    dispatch({
      type: "loadCalabrioUsers",
      payload: agents.data
    });
  } catch (error) {
    console.error("Failed to fetch calabrio org from service");
    //We're not throwing an error here so that we can still load Triton Admin and use its other features if this fails
    //Additionally - there can be local issues we have to work out when trying to call this 
  }
};

const getCalabrioOrg = async (dispatch: any) => {
  try {
    const org: any = await getCalabrioOrgServiceCall();
    console.log("Calabrio Org", org);
    dispatch({
      type: "loadCalabrioOrg",
      payload: org.data
    });
  } catch (error) {
    console.error("Failed to fetch calabrio org from service");
    //We're not throwing an error here so that we can still load Triton Admin and use its other features if this fails
    //Additionally - there can be local issues we have to work out when trying to call this 
  }
};

const getCalabrioRoles = async (dispatch: any) => {
  try {
    const roles: any = await getCalabrioRolesServiceCall();
    console.log("Calabrio Roles", roles);
    dispatch({
      type: "loadCalabrioRoles",
      payload: roles.data
    });
  } catch (error) {
    console.error("Failed to fetch calabrio Roles from service");
    //We're not throwing an error here so that we can still load Triton Admin and use its other features if this fails
    //Additionally - there can be local issues we have to work out when trying to call this 
  }
};

const getProfiles = (dispatch: any) => new Promise((resolve, reject) => myAxios.get(apiPaths.GET_PROFILES)
  .then(res => {
    dispatch({
      type: "loadProfiles",
      payload: res.data
    });
    resolve(true);
  })
  .catch(error => {
    reject({
      msg: "Failed to fetch profiles from service",
      error
    });
  })
);

const getSkills = (dispatch: any) => new Promise((resolve, reject) => myAxios.get(apiPaths.GET_SKILLS)
  .then(res => {
    dispatch({
      type: "loadSkills",
      payload: res.data.consolidatedSkills
    });
    resolve(true);
  })
  .catch(error => {
    reject({
      msg: "Failed to fetch skills from service",
      error
    });
  })
);

const getWorkers = async (dispatch: any) => {
  try {
    const response = await myAxios.get(apiPaths.GET_WORKERS);
    // filter out workers with "inactiveInd": true or no attributes
    const filteredWorkers = formatWorkerResponse(response.data).filter(worker => !worker.inactiveInd && worker.attributes);
    dispatch(({
      type: "addWorkers",
      payload: filteredWorkers
    }));
    return filteredWorkers;
  } catch (error) {
    throw ({
      msg: "Failed to fetch workers from service",
      error
    });
  }
};

export const runTritonAdminStartup = (dispatch: any) => {
  /* Please add new service calls to the end of this Promise.all,
  the existing order is important */
  return Promise.all([
    Promise.resolve(getStartupProfiles().TRITON.name),
    getWorkers(dispatch),
    getManagers(dispatch),
    getOffices(dispatch),
    getProfiles(dispatch),
    getSkills(dispatch),
    getCalabrioUsers(dispatch),
    getCalabrioOrg(dispatch),
    getCalabrioRoles(dispatch)
  ]);
};