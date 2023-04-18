import { getStartupProfiles } from "authentication";
import { apiPaths } from "globals";
import {
  getManagers as getManagersServiceCall,
  getOffices as getOfficesServiceCall,
  getWfmOptions,
  getWfmOrg,
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
import util from "util";
import zlib from "zlib";

const inflate = util.promisify(zlib.inflate);

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
    const users: any = await getCalabrioUsersServiceCall();
    console.log("Calabrio Users", users);
    dispatch({
      type: "loadCalabrioUsers",
      payload: users.data
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

const getCalabrioWfmOrg = async (dispatch: any) => {
  try {
    const org: any = await getWfmOrg();
    let orgData: any = [];
    try {
      let buff = Buffer.from(org.data.organization, 'base64');
      const data = await inflate(buff);
      orgData = JSON.parse(data.toString("utf-8"));
    } catch(err) {
      console.error("Failed to parse and save Calabrio Org data", err);
    }
    dispatch({
      type: "loadWfmOrg",
      payload: orgData.businessUnits
    });
  } catch (error) {
    console.error("Failed to fetch calabrio wfm org from service", error);
  }
};

const getCalabrioWfmOptions = async (dispatch: any) => {
  try {
    const options: any = await getWfmOptions();
    let optionsData: any = [];
    try {
      let buff = Buffer.from(options.data.organization, 'base64');
      const data = await inflate(buff);
      optionsData = JSON.parse(data.toString("utf-8"));
    } catch(err) {
      console.error("Failed to parse and save Calabrio Org data", err);
    }
    console.log("Calabrio WFM Options", optionsData);
    dispatch({
      type: "loadWfmOptions",
      payload: optionsData.businessUnits
    });
  } catch (error) {
    console.error("Failed to fetch calabrio wfm options from service");
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

const getProfiles = (dispatch: any) => new Promise((resolve, reject) => myAxios.get(apiPaths.PROFILES)
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
    dispatch({
      type: "loadSkillGroups",
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
      type: "loadWorkers",
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
    getCalabrioRoles(dispatch),
    getCalabrioWfmOptions(dispatch),
    getCalabrioWfmOrg(dispatch)
  ]);
};