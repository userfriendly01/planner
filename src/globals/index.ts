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
  GRAPH_API_HOST: `${window.env.GRAPH_API_ID}.appsync-api.us-east-1.amazonaws.com`,
  GRAPH_API_URL: `https://${window.env.GRAPH_API_ID}.appsync-api.us-east-1.amazonaws.com/graphql`,
  GRAPH_API_WSS: `wss://${window.env.GRAPH_API_ID}.appsync-realtime-api.us-east-1.amazonaws.com/graphql`,
  GRAPH_CLIENT_ID: window.env.GRAPH_CLIENT_ID,
  SOFTPHONE_SERVICE_URL: window.env.SOFTPHONE_SERVICE_URL,
  CALABRIO_SERVICE_URL: window.env.CALABRIO_SERVICE_URL,
  CALABRIO_SERVICE_CLIENT_ID: window.env.CALABRIO_SERVICE_CLIENT_ID,
  ADMIN_CLIENT_URL: window.env.ADMIN_CLIENT_URL,
  ADMIN_CLIENT_ID: window.env.ADMIN_CLIENT_ID
};

const SERVICE_BASE_URI = env.SOFTPHONE_SERVICE_URL;
const MS_GRAPH_URL = "https://graph.microsoft.com/v1.0";
const CALABRIO_SERVICE_BASE_URI = env.CALABRIO_SERVICE_URL;
const ADMIN_CLIENT_URL = env.ADMIN_CLIENT_URL;

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
    title: "Backup Workers",
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

export const termedUserExportColumns = [
  ...exportColumns,
  {
    field: "inactive_date",
    title: "Inactive Date",
    width: "100px"
  },
  {
    field: "inactive_forward_to",
    title: "Inactive Forward To",
    width: "100px"
  }
];

export const apiPaths = {
  CREATE_CALABRIO_TEAM: `${CALABRIO_SERVICE_BASE_URI}/qm?api=Team`,
  CREATE_CALABRIO_USER: `${CALABRIO_SERVICE_BASE_URI}/qm?api=User`,
  CREATE_CALABRIO_WFM_PERSON: `${CALABRIO_SERVICE_BASE_URI}/wfm/person`,
  CLOSED_MESSAGE: `${SERVICE_BASE_URI}/closedmessage`,
  CREATE_SKILL: `${SERVICE_BASE_URI}/createskill`,
  EMPLOYEE_LOOKUP: (nNumber: string): string => `${MS_GRAPH_URL}/users?$filter=employeeId eq '${nNumber}'&$select=mail,givenName,surname,officeLocation,extension_128b6233d06d4df391d7de26c982b64e_extensionAttribute1,department,extension_128b6233d06d4df391d7de26c982b64e_extensionAttribute2,accountEnabled`,
  FLASH_MESSAGE: `${SERVICE_BASE_URI}/flashmessage`,
  GET_APPLICATIONS: `${SERVICE_BASE_URI}/applications`,
  GET_CALABRIO_WFM: `${CALABRIO_SERVICE_BASE_URI}/wfm`,
  GET_CALABRIO_WFM_ORG: `${CALABRIO_SERVICE_BASE_URI}/wfm/org/people`,
  GET_CALABRIO_WFM_OPTIONS: `${CALABRIO_SERVICE_BASE_URI}/wfm/org/options`,
  GET_CALABRIO_WFM_USER_BY_NNUMBER: (nNumber: string): string => `${CALABRIO_SERVICE_BASE_URI}/wfm?api=People%20by%20Employment%20Ids&NNumbers=${nNumber}`,
  GET_CALABRIO_USERS: `${CALABRIO_SERVICE_BASE_URI}/qm?api=Users`,
  GET_CALABRIO_ORG: `${CALABRIO_SERVICE_BASE_URI}/qm?api=getOrg`,
  GET_CALABRIO_ROLES: `${CALABRIO_SERVICE_BASE_URI}/qm?api=Roles`,
  GET_CALABRIO_USER: (personId: number): any => `${CALABRIO_SERVICE_BASE_URI}/qm?api=User&userId=${personId}`,
  GET_CALABRIO_USER_PROFILES: `${CALABRIO_SERVICE_BASE_URI}/qm?api=Get%20All%20Profiles&includeInactive=true`,
  GET_SKILLS: `${SERVICE_BASE_URI}/consolidatedskills`,
  SKILLS_TASKROUTER: `${SERVICE_BASE_URI}/taskrouterskills`,
  SKILLS_CALLFLOW: `${SERVICE_BASE_URI}/callflowskills`,
  GET_OU: `${SERVICE_BASE_URI}/operatingunit`,
  TASK_QUEUES: `${SERVICE_BASE_URI}/taskqueues`,
  GET_TIME_OF_DAYS: `${SERVICE_BASE_URI}/timeofday`,
  RESET_WORKER_SKILLS: `${SERVICE_BASE_URI}/resetworkerskills`,
  TFN_DATA: `${SERVICE_BASE_URI}/tfn`,
  UPDATE_CALABRIO_USER: `${CALABRIO_SERVICE_BASE_URI}/qm?api=User`,
  UPDATE_CALABRIO_TEAM: `${CALABRIO_SERVICE_BASE_URI}/qm?api=Team`,
  RESET_PROFILES: (nNumber: string): string => `${ADMIN_CLIENT_URL}/reset/${nNumber}`,
  TERMINATE_WORKER: `${ADMIN_CLIENT_URL}/termination`,
  WFM_ACTIVATE_EXTERNAL_LOGON: `${ADMIN_CLIENT_URL}/externalLogon`
};

export const authConfig = {
  auth: {
    clientId: env.AZURE_CLIENT_ID,
    authority: "https://login.microsoftonline.com/LibertyMutual.onmicrosoft.com",
    redirectUri: env.AZURE_REDIRECT_URI,
    navigateToLoginRequestUrl: true
  }
};
