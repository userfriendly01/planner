const CONTACT_MANAGER_BASE_URI = "/contact-manager";
const SERVICE_BASE_URI = "/service";

export const apiPaths = {
  AUTH: `${SERVICE_BASE_URI}/admin-login`,
  CREATE_WORKER: `${SERVICE_BASE_URI}/createworker`,
  EDIT_WORKER: `${SERVICE_BASE_URI}/updateWorkerAttributes`,
  EMPLOYEE_LOOKUP: nNum => `${SERVICE_BASE_URI}/employeelookup/${nNum}`,
  GET_PROFILES: `${CONTACT_MANAGER_BASE_URI}/profiles`,
  GET_WORKERS: `${SERVICE_BASE_URI}/workers`,
  GET_WORKERS_BY_ID: `${SERVICE_BASE_URI}/workers/id/`
};

export const nNumMatcher = /[n,N]\d{7}/g;

export * from "./theme";
