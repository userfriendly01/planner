const CONTACT_MANAGER_BASE_URI = "/contact-manager";
const SERVICE_BASE_URI = "/service";

export const apiPaths = {
  AUTH: `${SERVICE_BASE_URI}/admin-login`,
  CREATE_WORKER: `${SERVICE_BASE_URI}/createworker`,
  EMPLOYEE_LOOKUP: nNum => `${SERVICE_BASE_URI}/employeelookup/${nNum}`,
  GET_PROFILES: `${CONTACT_MANAGER_BASE_URI}/profiles`,
  GET_TASKROUTER_SKILLS: `${SERVICE_BASE_URI}/taskrouterskills`,
  GET_WORKERS: `${SERVICE_BASE_URI}/workers`,
  GET_WORKERS_BY_ID: `${SERVICE_BASE_URI}/workers/id/`,
  RESET_WORKER_SKILLS: `${SERVICE_BASE_URI}/resetworkerskills`,
  UPDATE_FLASH_MESSAGE: `${SERVICE_BASE_URI}/updateflashmessage`,
  UPDATE_WORKER_ATTRIBUTES: `${SERVICE_BASE_URI}/updateworkerattributes`
};

export const nNumMatcher = /[n,N]\d{7}/g;

export const resetResponses = {
  SKILLS_WERE_EQUAL: "Worker default_skills is equal to currently assigned skills"
};

export const workersPerPage = 15;

export * from "./theme";
