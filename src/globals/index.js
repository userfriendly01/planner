const CONTACT_MANAGER_BASE_URI = "/contact-manager";
const SERVICE_BASE_URI = "/service";

export const apiPaths = {
  AUTH: `${SERVICE_BASE_URI}/admin-login`,
  CREATE_WORKER: `${SERVICE_BASE_URI}/createworker`,
  DELETE_WORKER: workerSid => `${SERVICE_BASE_URI}/deleteworker/${workerSid}`,
  DIAL_LIST: `${CONTACT_MANAGER_BASE_URI}/diallist`,
  DIAL_LIST_ENTRY: dialListId => `${CONTACT_MANAGER_BASE_URI}/diallist/${dialListId}`,
  EMPLOYEE_LOOKUP: nNum => `${SERVICE_BASE_URI}/employeelookup/${nNum}`,
  CHECK_EXTENSION: `${SERVICE_BASE_URI}/checkextension`,
  FLASH_MESSAGE: `${SERVICE_BASE_URI}/flashmessage`,
  GET_PROFILE_DATA: profileId => `${CONTACT_MANAGER_BASE_URI}/triton/${profileId}`,
  GET_PROFILES: `${CONTACT_MANAGER_BASE_URI}/profiles`,
  GET_TASKROUTER_SKILLS: `${SERVICE_BASE_URI}/taskrouterskills`,
  GET_WORKERS: `${SERVICE_BASE_URI}/workers`,
  GET_WORKERS_BY_ID: `${SERVICE_BASE_URI}/workers/id/`,
  RESET_WORKER_SKILLS: `${SERVICE_BASE_URI}/resetworkerskills`,
  UPDATE_WORKER_ATTRIBUTES: `${SERVICE_BASE_URI}/updateworkerattributes`
};

export const formModes = {
  INSERT: "insert",
  UPDATE: "update"
};

export const modalOverlayStatuses = {
  FAIL: "fail",
  SAVING: "saving",
  SUCCESS: "success"
};

export const nNumMatcher = /[n,N]\d{7}/g;
export const extensionMatcher = /^\d{4}$/;

export const resetResponses = {
  SKILLS_WERE_EQUAL: "Worker default_skills is equal to currently assigned skills"
};

export const timeouts = {
  AUTH: 3600 * 1000,
  MODAL_OVERLAY: 2000
};

export const workersPerPage = 15;

export * from "./theme";
