import { FormModes } from "globals/interfaces";

// We're adding this to the window and can really be anywhere
// We'll put it here for reference to the below on why it's neede
declare global {
  interface Window {
    env: {
      [key: string]: string
    }
  }
}

export const env = {
  AZURE_CLIENT_ID: window.env.AZURE_CLIENT_ID,
  AZURE_REDIRECT_URI: window.env.AZURE_REDIRECT_URI,
  DATADOG_APPLICATION_ID: window.env.DATADOG_APPLICATION_ID,
  DATADOG_CLIENT_TOKEN: window.env.DATADOG_CLIENT_TOKEN,
  APP_ENV: window.env.APP_ENV,
  TROUX_ID: window.env.TROUX_ID,
  GRAPH_API_URL: window.env.GRAPH_API_URL,
  GRAPH_CLIENT_ID: window.env.GRAPH_CLIENT_ID,
  SOFTPHONE_SERVICE_URL: window.env.SOFTPHONE_SERVICE_URL
};

const SERVICE_BASE_URI = env.SOFTPHONE_SERVICE_URL;
const MS_GRAPH_URL = "https://graph.microsoft.com/v1.0";

export const numMatcher = /^[0-9]*$/;
export const nNumMatcher = /[n,N]\d{7}/g;
export const extensionMatcher = /^\d{4,5}$/;

export const formModes: FormModes = {
  INSERT: "insert",
  UPDATE: "update",
  DELETE: "delete"
};

export const timeouts = {
  MODAL_OVERLAY: 2000,
  MODAL_OVERLAY_ATTENTION: 5000
};

export const resetResponses = {
  SKILLS_WERE_EQUAL: "Worker default_skills is equal to currently assigned skills"
};

export const exportColumns = [
  {
    field: "sid",
    title: "Worker Sid",
    width: "100px"
  },
  {
    field: "emp_first_name",
    title: "First Name",
    width: "100px"
  },
  {
    field: "emp_last_name",
    title: "Last Name",
    width: "100px"
  },
  {
    field: "n_number",
    title: "N Number",
    width: "100px"
  },
  {
    field: "email",
    title: "Email",
    width: "100px"
  },
  {
    field: "extension",
    title: "Extension",
    width: "100px"
  },
  {
    field: "profile_id",
    title: "Profile Id",
    width: "100px"
  },
  {
    field: "manager_n_number",
    title: "Manager N Number",
    width: "100px"
  },
  {
    field: "manager",
    title: "Manager",
    width: "100px"
  },
  {
    field: "department_name",
    title: "Department",
    width: "100px"
  },
  {
    field: "routing_team",
    title: "Routing Team",
    width: "100px"
  },
  {
    field: "routing_caller_states",
    title: "Routing Caller States",
    width: "100px"
  },
  {
    field: "ou",
    title: "OU",
    width: "100px"
  },
  {
    field: "sales_assoc_workers",
    title: "Sales Associate Workers",
    width: "100px"
  },
  {
    field: "backup_workers",
    title: "FTO Backup Workers",
    width: "100px"
  },
  {
    field: "roles",
    title: "Roles",
    width: "100px"
  },
  {
    field: "outbound_number",
    title: "Outbound Number",
    width: "100px"
  },
  {
    field: "did",
    title: "Direct Dial Number",
    width: "100px"
  },
  {
    field: "current_skills",
    title: "Current Skills",
    width: "100px"
  },
  {
    field: "default_skills",
    title: "Default Skills",
    width: "100px"
  },
  {
    field: "disabled_skills",
    title: "Disabled Skills",
    width: "100px"
  }
];

export const apiPaths = {
  CHECK_EXTENSION: `${SERVICE_BASE_URI}/checkextension`,
  CREATE_CALABRIO_TEAM: `${SERVICE_BASE_URI}/calabrio-add-team`,
  CREATE_CALABRIO_USER: `${SERVICE_BASE_URI}/calabrio-add-user`,
  CREATE_CALABRIO_WFM_PERSON: `${SERVICE_BASE_URI}/calabrio-api/wfm/person`,
  CLOSED_MESSAGE: `${SERVICE_BASE_URI}/closedmessage`,
  CREATE_SKILL: `${SERVICE_BASE_URI}/createskill`,
  EMPLOYEE_LOOKUP: (nNumber: string): string => `${MS_GRAPH_URL}/users?$filter=employeeId eq '${nNumber}'&$select=mail,givenName,surname,officeLocation,extension_128b6233d06d4df391d7de26c982b64e_extensionAttribute1,department,extension_128b6233d06d4df391d7de26c982b64e_extensionAttribute2,accountEnabled`,
  FLASH_MESSAGE: `${SERVICE_BASE_URI}/flashmessage`,
  GET_APPLICATIONS: `${SERVICE_BASE_URI}/applications`,
  GET_CALABRIO_WFM: `${SERVICE_BASE_URI}/calabrio-api/wfm`,
  GET_CALABRIO_WFM_ORG: `${SERVICE_BASE_URI}/calabrio-api/wfm/org/people`,
  GET_CALABRIO_WFM_OPTIONS: `${SERVICE_BASE_URI}/calabrio-api/wfm/org/options`,
  GET_CALABRIO_WFM_USER_BY_NNUMBER: (nNumber: string): string => `${SERVICE_BASE_URI}/calabrio-api/wfm-people-by-nnumber/${nNumber}`,
  GET_CALABRIO_USERS: `${SERVICE_BASE_URI}/calabrio-get-agents`,
  GET_CALABRIO_ORG: `${SERVICE_BASE_URI}/calabrio-get-org`,
  GET_CALABRIO_ROLES: `${SERVICE_BASE_URI}/calabrio-get-roles`,
  GET_CALABRIO_USER: (personId: number): any => `${SERVICE_BASE_URI}/calabrio-get-user/${personId}`,
  GET_CALABRIO_USER_PROFILES: `${SERVICE_BASE_URI}/calabrio-api/qm-user-profiles`,
  GET_SKILLS: `${SERVICE_BASE_URI}/consolidatedskills`,
  SKILLS_TASKROUTER: `${SERVICE_BASE_URI}/taskrouterskills`,
  SKILLS_CALLFLOW: `${SERVICE_BASE_URI}/callflowskills`,
  GET_OU: `${SERVICE_BASE_URI}/operatingunit`,
  TASK_QUEUES: `${SERVICE_BASE_URI}/taskqueues`,
  GET_TIME_OF_DAYS: `${SERVICE_BASE_URI}/timeofday`,
  GET_RESET_PROFILE_DATADOG_LOGS: (nNumber: string): string => `${SERVICE_BASE_URI}/datadogresetprofileslogs/${nNumber}`,
  RESET_PROFILES: (nNumber: string): string => `${SERVICE_BASE_URI}/resetprofiles/${nNumber}`,
  RESET_WORKER_SKILLS: `${SERVICE_BASE_URI}/resetworkerskills`,
  TERMINATE_WORKER: `${SERVICE_BASE_URI}/terminateworker`,
  TFN_DATA: `${SERVICE_BASE_URI}/tfn`,
  UPDATE_CALABRIO_USER: (personId: number): any => `${SERVICE_BASE_URI}/calabrio-update-user/${personId}`,
  WFM_ACTIVATE_EXTERNAL_LOGON: `${SERVICE_BASE_URI}/wfmexternallogon`
};

export const authConfig = {
  auth: {
    clientId: env.AZURE_CLIENT_ID,
    authority: "https://login.microsoftonline.com/LibertyMutual.onmicrosoft.com",
    redirectUri: env.AZURE_REDIRECT_URI,
    navigateToLoginRequestUrl: true
  }
};
