import {
  ModalOverlayStatuses,
  FormModes
} from "globals";

const CONTACT_MANAGER_BASE_URI = "/contact-manager";
const SERVICE_BASE_URI = "/service";

export * from "./interfaces";
export * from "./theme";
export * from "./styles";

export const nNumMatcher = /[n,N]\d{7}/g;
export const extensionMatcher = /^\d{4}$/;
export const workersPerPage = 15;

export const modalOverlayStatuses: ModalOverlayStatuses = {
  FAIL: "fail",
  SAVING: "saving",
  SUCCESS: "success"
};

export const formModes: FormModes = {
  INSERT: "insert",
  UPDATE: "update"
};

export const timeouts = {
  AUTH: 3600 * 1000,
  MODAL_OVERLAY: 2000
};

export const resetResponses = {
  SKILLS_WERE_EQUAL: "Worker default_skills is equal to currently assigned skills"
};

export const apiPaths = {
  AUTH: `${SERVICE_BASE_URI}/admin-login`,
  CHECK_EXTENSION: `${SERVICE_BASE_URI}/checkextension`,
  CREATE_WORKER: `${SERVICE_BASE_URI}/createworker`,
  DELETE_WORKER: (workerSid: string): string => `${SERVICE_BASE_URI}/deleteworker/${workerSid}`,
  DIAL_LIST: `${CONTACT_MANAGER_BASE_URI}/diallist`,
  DIAL_LIST_ENTRY: (dialListId: number): string => `${CONTACT_MANAGER_BASE_URI}/diallist/${dialListId}`,
  DIRECTORY: `${CONTACT_MANAGER_BASE_URI}/directory`,
  DIRECTORY_ENTRY: (directoryId: string | number): string => `${CONTACT_MANAGER_BASE_URI}/directory/${directoryId}`,
  EMPLOYEE_LOOKUP: (nNumber: string): string => `${SERVICE_BASE_URI}/employeelookup/${nNumber}`,
  FLASH_MESSAGE: `${SERVICE_BASE_URI}/flashmessage`,
  GET_PROFILE_DATA: (profileId: string | number): string => `${CONTACT_MANAGER_BASE_URI}/triton/${profileId}`,
  GET_PROFILES: `${CONTACT_MANAGER_BASE_URI}/profiles`,
  GET_TASKROUTER_SKILLS: `${SERVICE_BASE_URI}/taskrouterskills`,
  GET_WORKERS: `${SERVICE_BASE_URI}/workers`,
  MANAGERS: `${CONTACT_MANAGER_BASE_URI}/managers`,
  OFFICES: `${CONTACT_MANAGER_BASE_URI}/offices`,
  RESET_WORKER_SKILLS: `${SERVICE_BASE_URI}/resetworkerskills`,
  UPDATE_WORKER: (workerSid: string): string => `${SERVICE_BASE_URI}/updateworker/${workerSid}`
};

export const profileConfigs = {
  PROFILE_SKILL_MAP: [
    {
      "profileId": 4,
      "skills": ["aisgL1", "aisgConsumer", "aisgEcliq", "aisgPassword"]
    },
    {
      "profileId": 7,
      "skills": ["csoService", "csoBilling", "csoPortal"]
    }
  ]
};