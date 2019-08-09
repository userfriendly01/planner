
const CONTACT_MANAGER_BASE_URI = "/contact-manager";
const SERVICE_BASE_URI = "/service";

export const apiPaths = {
  AUTH: `${SERVICE_BASE_URI}/admin-login`,
  CREATE_WORKER: `${SERVICE_BASE_URI}/createworker`,
  GET_PROFILES: `${CONTACT_MANAGER_BASE_URI}/profiles`,
  GET_WORKER_BY_ID: nNum => `${SERVICE_BASE_URI}/workers/id/${nNum}`,
  GET_WORKERS: `${SERVICE_BASE_URI}/workers`
};