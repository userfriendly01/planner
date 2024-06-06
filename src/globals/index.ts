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
  SOFTPHONE_SERVICE_URL: window.env.SOFTPHONE_SERVICE_URL
};

const CONTACT_MANAGER_BASE_URI = `${env.SOFTPHONE_SERVICE_URL}/contact-manager`;
const SERVICE_BASE_URI = env.SOFTPHONE_SERVICE_URL;

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

export const profileTableColumnHeader = [
  {
    COLUMN_NAME: "ID",
    TOOLTIP: "Unique Profile Identification"
  },
  {
    COLUMN_NAME: "Name",
    TOOLTIP: "Profile Name"
  },
  {
    COLUMN_NAME: "Inbound Recorded",
    TOOLTIP: "All inbound calls are automatically recorded"
  },
  {
    COLUMN_NAME: "Auto Answered",
    TOOLTIP: "Automatically accepts a call and routes to an agent"
  },
  {
    COLUMN_NAME: "Payment Processing",
    TOOLTIP: "UI Feature: Click for payment button is enabled to manually pause/resume call recordings"
  },
  {
    COLUMN_NAME: "Outbound Recorded",
    TOOLTIP: "All outbound calls are automatically recorded"
  },
  {
    COLUMN_NAME: "ACW Option",
    TOOLTIP: "UI Feature: Agent has the choice to enable or disable after call work (wrap-up). Default setting is off"
  },
  {
    COLUMN_NAME: "Manual Recorded",
    TOOLTIP: "UI Feature: Manual recording button appears in call controls when enabled. User will have the ability to manually start and stop recordings"
  },
  {
    COLUMN_NAME: "ACW Data Entry",
    TOOLTIP: "UI Feature: If enabled, during wrap-up, call tagging toggle appears which gives an input form to the user"
  },
  {
    COLUMN_NAME: "Manual Recorded Inbound",
    TOOLTIP: "UI Feature: Manual recording button appears in call controls when enabled. User will have the ability to manually start and stop recordings on inbound calls"
  },
  {
    COLUMN_NAME: "Agent Assisted Pay",
    TOOLTIP: "Not a currently enabled UI feature"
  },
  {
    COLUMN_NAME: "Overflow Skill",
    TOOLTIP: "An agent misses a call and it is forwarded to the next available agent with the same manager"
  },
  {
    COLUMN_NAME: "Policy Number Edit",
    TOOLTIP: "UI Feature: An agent can capture and save a different policy number than what the IVR previously loaded"
  },
  {
    COLUMN_NAME: "Voice Mail Transcription",
    TOOLTIP: "Voice mail will be transcribed and sent within the notification email to the user"
  },
  {
    COLUMN_NAME: "Click To Dial",
    TOOLTIP: "Enable click-to-dial/transfer from external application"
  },
  {
    COLUMN_NAME: "Call Reason",
    TOOLTIP: "UI Feature: Allows agent to record call reason data."
  },
  {
    COLUMN_NAME: "EFT Authorization",
    TOOLTIP: "Enable EFT authorization tagging on recordings"
  },

  {
    COLUMN_NAME: "Claim Number Edit",
    TOOLTIP: "UI Feature: An agent can capture and save a different claim number than what the IVR previously loaded"
  },
  {
    COLUMN_NAME: "Self Service Indicator",
    TOOLTIP: "Self service indicator is applicable to profiles with an id of 39 and above, but is actually set at the worker attribute level"
  },
  {
    COLUMN_NAME: "Activities",
    TOOLTIP: "Profile Activities"
  },
  {
    COLUMN_NAME: "Transfer Queues",
    TOOLTIP: "UI Feature: Additional transfer queues that will appear in the Triton queue ticker"
  },
  {
    COLUMN_NAME: "Access Group",
    TOOLTIP: "Access Group Name for BPO profiles"
  },
  {
    COLUMN_NAME: "Operating Unit",
    TOOLTIP: "Which OU a profile is assigned to"
  },
  {
    COLUMN_NAME: "Forward to Number",
    TOOLTIP: "Default forward to number to be used when no overflow skill exists"
  }
];

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
  // DELETE_WORKER: (workerSid: string): string => `${SERVICE_BASE_URI}/deleteworker/${workerSid}`,
  DIAL_LIST: `${CONTACT_MANAGER_BASE_URI}/diallist`,
  DIAL_LIST_ENTRY: (dialListId: number): string => `${CONTACT_MANAGER_BASE_URI}/diallist/${dialListId}`,
  DIRECTORY: `${CONTACT_MANAGER_BASE_URI}/directory`,
  DIRECTORY_ENTRY: (directoryId: string | number): string => `${CONTACT_MANAGER_BASE_URI}/directory/${directoryId}`,
  EMPLOYEE_LOOKUP: (nNumber: string): string => `${SERVICE_BASE_URI}/employeelookup/${nNumber}`,
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
  GET_PROFILE_DATA: (profileId: string | number): string => `${CONTACT_MANAGER_BASE_URI}/triton/${profileId}`,
  GET_CALL_TAGS_OPTIONS: `${CONTACT_MANAGER_BASE_URI}/workertaskinfooptions`,
  GET_CALL_TAGS: `${CONTACT_MANAGER_BASE_URI}/workertaskinfo`,
  GET_ACTIVITIES: `${CONTACT_MANAGER_BASE_URI}/activities`,
  GET_ACCESS_GROUP: `${CONTACT_MANAGER_BASE_URI}/accessgroup`,
  GET_SKILLS: `${SERVICE_BASE_URI}/consolidatedskills`,
  GET_OU: `${SERVICE_BASE_URI}/operatingunit`,
  GET_TASK_QUEUES: `${SERVICE_BASE_URI}/taskqueues`,
  GET_TIME_OF_DAYS: `${SERVICE_BASE_URI}/timeofday`,
  GET_RESET_PROFILE_DATADOG_LOGS: (nNumber: string): string => `${SERVICE_BASE_URI}/datadogresetprofileslogs/${nNumber}`,
  PROFILES: `${CONTACT_MANAGER_BASE_URI}/profiles`,
  RESET_PROFILES: (nNumber: string): string => `${SERVICE_BASE_URI}/resetprofiles/${nNumber}`,
  RESET_WORKER_SKILLS: `${SERVICE_BASE_URI}/resetworkerskills`,
  SKILL_GROUPS: `${CONTACT_MANAGER_BASE_URI}/skillgroups`,
  TERMINATE_WORKER: `${SERVICE_BASE_URI}/terminateworker`,
  TFN_DATA: `${SERVICE_BASE_URI}/tfn`,
  UPDATE_CALABRIO_USER: (personId: number): any => `${SERVICE_BASE_URI}/calabrio-update-user/${personId}`,
  GET_AGGREGATE_QUEUES_TYPE: (aggregateQueueType: string): string => `${CONTACT_MANAGER_BASE_URI}/aggregatequeuestype/${aggregateQueueType}`,
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
