import { FormModes } from "globals";

export * from "./interfaces";
export * from "./theme";
export * from "./styles";

const CONTACT_MANAGER_BASE_URI = "/contact-manager";
const SERVICE_BASE_URI = "/service";

export const nNumMatcher = /[n,N]\d{7}/g;
export const extensionMatcher = /^\d{4,5}$/;
export const workersPerPage = 15;

export const formModes: FormModes = {
  INSERT: "insert",
  UPDATE: "update",
  DELETE: "delete"
};

export const timeouts = {
  AUTH: 3600 * 1000,
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
    COLUMN_NAME: "Claim Number",
    TOOLTIP: "Enable Claim Number tagging on recordings"
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
    field: "directDialNum",
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
  AUTH: `${SERVICE_BASE_URI}/admin-login`,
  CHECK_EXTENSION: `${SERVICE_BASE_URI}/checkextension`,
  CREATE_CALABRIO_TEAM: `${SERVICE_BASE_URI}/calabrio-add-team`,
  CREATE_CALABRIO_USER: `${SERVICE_BASE_URI}/calabrio-add-user`,
  CREATE_CALABRIO_WFM_PERSON: `${SERVICE_BASE_URI}/calabrio-api/wfm/person`,
  CLOSED_MESSAGE: `${SERVICE_BASE_URI}/closedmessage`,
  CREATE_SKILL: `${SERVICE_BASE_URI}/createskill`,
  CREATE_WORKER: `${SERVICE_BASE_URI}/createworker`,
  DELETE_WORKER: (workerSid: string): string => `${SERVICE_BASE_URI}/deleteworker/${workerSid}`,
  DIAL_LIST: `${CONTACT_MANAGER_BASE_URI}/diallist`,
  DIAL_LIST_ENTRY: (dialListId: number): string => `${CONTACT_MANAGER_BASE_URI}/diallist/${dialListId}`,
  DIRECTORY: `${CONTACT_MANAGER_BASE_URI}/directory`,
  DIRECTORY_ENTRY: (directoryId: string | number): string => `${CONTACT_MANAGER_BASE_URI}/directory/${directoryId}`,
  EMPLOYEE_LOOKUP: (nNumber: string): string => `${SERVICE_BASE_URI}/employeelookup/${nNumber}`,
  FLASH_MESSAGE: `${SERVICE_BASE_URI}/flashmessage`,
  GET_APPLICATIONS: `${SERVICE_BASE_URI}/applications`,
  GET_CALABRIO_WFM_BUS: `${SERVICE_BASE_URI}/calabrio-api/wfm/Business Units`,
  GET_CALABRIO_WFM_ORG: `${SERVICE_BASE_URI}/calabrio-api/wfm/org/people`,
  GET_CALABRIO_WFM_OPTIONS: `${SERVICE_BASE_URI}/calabrio-api/wfm/org/options`,
  GET_CALABRIO_USERS: `${SERVICE_BASE_URI}/calabrio-get-agents`,
  GET_CALABRIO_ORG: `${SERVICE_BASE_URI}/calabrio-get-org`,
  GET_CALABRIO_ROLES: `${SERVICE_BASE_URI}/calabrio-get-roles`,
  GET_CALABRIO_USER: (personId: number): any => `${SERVICE_BASE_URI}/calabrio-get-user/${personId}`,
  GET_PROFILE_DATA: (profileId: string | number): string => `${CONTACT_MANAGER_BASE_URI}/triton/${profileId}`,
  GET_CALL_TAGS_OPTIONS: `${CONTACT_MANAGER_BASE_URI}/workertaskinfooptions`,
  GET_CALL_TAGS: `${CONTACT_MANAGER_BASE_URI}/workertaskinfo`,
  GET_ACTIVITIES: `${CONTACT_MANAGER_BASE_URI}/activities`,
  GET_ACCESS_GROUP: `${CONTACT_MANAGER_BASE_URI}/accessgroup`,
  GET_JOKES: `${SERVICE_BASE_URI}/getJokes`,
  GET_SKILLS: `${SERVICE_BASE_URI}/consolidatedskills`,
  GET_OU: `${SERVICE_BASE_URI}/operatingunit`,
  GET_TASK_QUEUES: `${SERVICE_BASE_URI}/taskqueues`,
  GET_TIME_OF_DAYS: `${SERVICE_BASE_URI}/timeofday`,
  GET_WORKERS: `${SERVICE_BASE_URI}/workers`,
  MANAGERS: `${CONTACT_MANAGER_BASE_URI}/managers`,
  OFFICES: `${CONTACT_MANAGER_BASE_URI}/offices`,
  PROFILES: `${CONTACT_MANAGER_BASE_URI}/profiles`,
  RESET_WORKER_SKILLS: `${SERVICE_BASE_URI}/resetworkerskills`,
  SKILL_GROUPS: `${CONTACT_MANAGER_BASE_URI}/skillgroups`,
  TFN_DATA: `${SERVICE_BASE_URI}/tfn`,
  UPDATE_CALABRIO_USER: (personId: number): any => `${SERVICE_BASE_URI}/calabrio-update-user/${personId}`,
  UPDATE_WORKER: (workerSid: string): string => `${SERVICE_BASE_URI}/updateworker/${workerSid}`,
  GET_AGGREGATE_QUEUES_TYPE: (aggregateQueueType: string): string => `${CONTACT_MANAGER_BASE_URI}/aggregatequeuestype/${aggregateQueueType}`,
  WFM_ACTIVATE_EXTERNAL_LOGON: `${SERVICE_BASE_URI}/wfmexternallogon`
};