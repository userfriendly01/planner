import { CalabrioGroup } from "../components/tabs/usermanagement/OnboardNewUser/CallRecording/CallRecording.Interfaces";
import {
  AuthenticationProfile, Permissions
} from "authentication/authenticationInterfaces";

export interface Action {
  type: string,
  [key: string]: any
}

export const discrepancyType = {
  CALABRIO_QM: "Calabrio QM",
  CALABRIO_WFM: "Calabrio WFM",
  TRITON: "Triton",
  GENERAL: "General"
};
export interface Discrepancy {
  message: string,
  type: string
}

export interface AppState {
  managerContext: {
    managers: UMManager[]
  },
  officeContext: {
    offices: UMOffice[]
  },
  profileContext: {
    profiles: TritonProfile[]
  },
  skillContext: {
    skills: Skill[],
    skillGroups: SkillGroup[]
  },
  userContext: {
    permissions: ADGroupPermission[]
    accessToken: string
    isAdmin?: boolean
    profileId?: number
    nNumber?: string
  },
  workerContext: {
    workers: UMUser[],
    isLoading: boolean;
  },
  calabrioContext: {
    tenant: any,
    teams: CalabrioGroup[],
    groups: CalabrioGroup[],
    users: any[],
    roles: any[],
    wfmOrg: any[],
    wfmOptions: any[],
    wfmErrors: any[]
  },
  resettingSkills: false,
  userManagementTableFilters: {
    managerFilter: string,
    profileFilterArray: any[],
    ouFilterArray: any[]
  }
}

export interface ADGroupRole {
  name: string;
  permissionLevel: Permissions;
}

export interface ADGroupPermission {
    roles: ADGroupRole[];
    startup: {
      name: string;
      function: (dispatch: any) => Promise<any>;
    }
    description: string;
    authenticationProfile:  AuthenticationProfile
}

export interface FormModes {
  INSERT: string,
  UPDATE: string,
  DELETE: string
}

export interface UMManager {
  pk: string,
  sk: string,
  item_type: string,
  manager_first_name: string,
  manager_last_name: string,
  profile_id: number,
  manager_n_num: string,
  calabrio_team_ids: number[],
}

export enum ModalOverlayStatuses {
  PARTIAL_FAIL = "partial fail",
  FAIL = "fail",
  SAVING = "saving",
  SUCCESS = "success"
}
export interface MySqlBoolean {
  data: [0 | 1],
  type: "Buffer"
}

export interface UMOffice {
  pk: string,
  sk: string,
  item_type: string,
  office_num: string,
  office_name: string
}

export interface Skill {
  [key: string]: any
  ctmSkillId: number,
  ctmSkillDisplayName: string,
  ctmSkillGroups: SkillGroup[],
  name: string,
  profiles: any[],
  closedMessage: string,
  flashMessage: string,
  levels: any[],
  timeOfDays: any[],
  vhCallTarget: string,
  vhCallerId: string,
  vhThreshold: number
}

export interface SkillGroup {
  skillGroupId: number,
  skillGroupNme: string,
  skills: Skill[],
}

export interface TritonProfile {
  acw_data_entry_i: MySqlBoolean,
  acw_option_i: MySqlBoolean,
  agent_assisted_pay_i: MySqlBoolean,
  auto_answd_i: MySqlBoolean,
  call_reason_i: MySqlBoolean,
  click_to_dial_i: MySqlBoolean,
  eft_authorization_i: MySqlBoolean,
  claim_number_edit_i: MySqlBoolean,
  manual_record_inbound_i: MySqlBoolean,
  manual_recorded_i: MySqlBoolean,
  otbnd_recorded_i: MySqlBoolean,
  pmt_prcsg_i: MySqlBoolean,
  policy_number_edit_i: MySqlBoolean,
  voice_mail_transcription_i: MySqlBoolean,
  profile_id: number,
  profile_nme: string,
  recorded_i: MySqlBoolean,
  row_crtn_dtm: string,
  row_updt_dtm: string,
  overflow_skill: string,
  activities: Array<Record<string, unknown>>,
  callTags: string,
  operating_unit_nme: string,
  operating_unit_sid: string
}

export interface ProfilePayload {
  profile_id: null | number,
  profile_nme: string,
  activities: Array<number>,
  recorded_i: boolean,
  auto_answd_i: boolean,
  pmt_prcsg_i: boolean,
  otbnd_recorded_i: boolean,
  acw_option_i: boolean,
  callTags: Array<Record<string, unknown>>,
  manual_recorded_i: boolean,
  acw_data_entry_i: boolean,
  manual_record_inbound_i: boolean,
  agent_assisted_pay_i: boolean,
  overflow_skill: string | null,
  policy_number_edit_i: boolean,
  voice_mail_transcription_i: boolean,
  call_reason_i: boolean,
  click_to_dial_i: boolean,
  eft_authorization_i: boolean,
  claim_number_edit_i: boolean,
  transferQueues: Array<Record<string, unknown>>,
  aggregateQueues: Array<number>
}

export interface Activity {
  activity_id: number,
  activity_nme: string,
  available_i: {
    data?: number[],
    type?: string
  }
}

export interface AggregateQueue {
  aggregate_queues_id: number,
  aggregate_queues_nme: string,
  aggregate_queues_type: string,
  owner_type: string,
  worker_sid: string | null,
  row_crtn_dtm: string | null,
  row_updt_dtm: string | null
}

export interface CallTag {
  wrkr_tsk_info_id: number,
  profile_id: number,
  display_nme: string,
  options_id: number,
  wrkr_tsk_info_nme: string
}

export interface CallTagOptions {
  options_id: number,
  options: string
}

export interface WfmBusinessUnit {
  Id: string,
  Name: string,
  People_Without_Team?: WfmUser[],
  Teams?: WfmTeam[],
  People?: WfmUser[]
}

export interface WfmTeam {
  Id: string,
  Name: string,
  TeamName: string
  People: WfmUser[],
  SiteId?: string,
  SiteName?: string
}

export interface WfmUser {
  OptionalColumns: any[],
  Id: string,
  Identity: string | null,
  FirstName: string,
  LastName: string,
  EmploymentNumber: string,
  Email: string,
  DisplayName: string,
  TerminationDate: string,
  EmploymentStartDate: string,
  TimeZoneId: string,
  BusinessUnitId: string,
  TeamId: string,
  PersonSkills: any[],
  AvailabilityId: string,
  AvailabilityStartDate?: string,
  AbsenceId: string,
  RotationId: string,
  RotationStartDate?: string,
  RotationStartWeek?: number,
  WorkflowControlSetId: string,
  ContractId: string,
  ContractScheduleId: string,
  BudgetGroupId: string,
  PartTimePercentageId: string,
  ShiftBagId: string,
  Note: string | null,
  Roles: any[],
  FirstDayOfWeek: number,
  TeamStartDate?: string,
  SkillsStartDate?: string,
  ParentTeam?: string //something we add to verify the team Id listed on the worker aligns to the team they were found in
}

export interface DBList<TItem> {
  items: TItem[];
  nextToken: string;
}

export interface GraphData {
  query: any,
  responsePath: string
}

export interface UMUserTwilioAttributes {
  contact_uri?: string,
  default_skills?: UMTwilioAttributeSkills,
  department_name?:string,
  department_id?:string,
  caller_id?: string,
  disabled_skills?: UMTwilioAttributeSkills,
  email?: string,
  email_address?: string,
  emp_first_name?: string,
  emp_last_name?: string,
  extension?: string,
  full_name?: string,
  location?:string,
  manager_first_name?: string,
  manager_last_name?: string,
  manager_n_number?: string,
  manager?:string,
  n_number?: string,
  office_location_name?: string,
  office_location_number?: string,
  primary_dept_name?: string,
  primary_dept_number?: string,
  profile_id?: number,
  roles?: string[],
  routing?: UMTwilioAttributeSkills,
  unique_id?: string,
  agent_id?: string,
}

export interface UMUser {
  pk: string;
  ttl: number;
  sid: string;                // mapped from --> worker_sid
  workerSid: string;          // mapped from --> worker_sid
  inactiveDate?: string;      // mapped from --> inactive_date
  inactiveForwardTo: string;  // mapped from --> inactive_forward_to
  zeroOutEnabled: boolean;    // mapped from --> zero_out_enabled
  selfServiceInd: boolean;    // mapped from --> self_service_ind
  operatingUnitSid: string;   // mapped from --> operating_unit_sid
  did?: string;
  twilio_attributes: string;  // Used for create and update

  // Added by us
  skillsDifferent: boolean;
  attributes: UMUserTwilioAttributes;  // mapped from --> twilio_attributes
  isConsole: boolean;                 // Will be true if pk contains Console
}

export interface UMTwilioAttributeSkills {
  levels: {
    [key: string]: number
  },
  skills: string[],
  team?:string,
  caller_states?: string[],
  sales_assoc_workers?: string[]
}


export interface AzureSPA {
  accessToken: string;
  matchedGroups: any[];
  azureClientId?: string;
}

export interface CalabrioQmUser {
  acdId: string,
  acdServerId: number,
  activated: number,
  adLogin: string,
  deactivated: number,
  displayId: string,
  email: string,
  firstName: string,
  groupId: number,
  id: number,
  isHotdeskDefaultUser: boolean,
  isReconcileOnly: boolean,
  isSynchronized: boolean,
  isSystemUser: boolean,
  lastName: string,
  timeZone: number
}

export interface TableStateProps {
  [key: string]: any,
  searchBy: string,
  selected: any,
  pagination: {
    usersPerPage: number,
    pageNumber: number,
    length: number,
    startingUserIndex: number | null,
    endingUserIndex: number | null
  },
  filteredList: any[]
}
export interface OperatingUnit {
  ou_sid: string,
  ou_name: string
}

export interface AccessGroup {
  access_group_id: number,
  access_group_nme: string,
  twilio_dashboard_url: string,
  viewable_profiles: Array<{
    profile_id: number,
    name: string
  }>
}

export type Control = "input" | "select" | "autoComplete" | "timePicker" | "multiField" | "multiTextField" | "switch";

export interface GraphQLErrors {
  errorType:string;
  message:string;
}

export interface DuplicateCheck{
  isDuplicate: boolean;
  message: string;
}
export interface BrandNameMap{
  [key:string]: "liberty" | "safeco"
}
