import { CalabrioGroup } from "usermanagement/CallRecording.Interfaces";
import {
  AuthenticationProfile, Permissions
} from "authentication/authenticationInterfaces";
import {
  AlertColor
} from "@mui/material";
import styled from "styled-components";

export const FlexColumn = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
`;

export const FlexRow = styled.div`
  display: flex;
  flex: 1 1 auto;
`;

export const AppError = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  font-size: 30;
  padding: 50;
`;

export const IconWrapper = styled.div`
  border-radius: ${props => props.theme.tableRow.icon.hoverDiameter / 2}px;
  color: ${props => props.theme.libertyDarkGray};
  cursor: pointer;
  display: flex;
  font-size: ${props => props.theme.tableRow.icon.size}px;
  height: ${props => props.theme.tableRow.icon.hoverDiameter}px;
  justify-content: center;
  width: ${props => props.theme.tableRow.icon.hoverDiameter}px;
  &:hover {
    background-color: ${props => props.theme.tableRow.selectedColor};
    cursor: pointer;
  }
`;

export interface GenericObject {
  [key: string]: any
}

export interface DropdownOption {
  label: string,
  value: any
}

export interface AlertBarProps {
    open: boolean;
    msg: string;
    severityType: AlertColor;
    duration?: number
}

export interface FormValidationProps {
    error?: boolean;
    value?: any;
    required?: boolean;
}

export interface FormValidationRule {
    [key: string]: FormValidationProps;
}

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

export enum LoadStatuses {
  FAIL = "fail",
  LOADING = "loading",
  SUCCESS = "success"
}

export interface AppState {
  managerContext: {
    managers: UMManager[]
  },
  profileContext: {
    profiles: UMSoftphoneConfiguration[],
    accessGroups: AccessGroup[],
    screenpops: Screenpop[]
    activities: Activity[],
    directoryEntries: DirectoryNumber[],
    dialListEntries: DialListNumber[]
  },
  userContext: {
    permissions: ADGroupPermission[];
    tokens: {
      [key: string]: string;
    };
    isAdmin?: boolean;
    profileId?: number;
    nNumber?: string;
  },
  workerContext: {
    workers: UMUser[],
    loadStatus: LoadStatuses;
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
      function: (dispatch: any, skillDispatch?: any) => Promise<any>;
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

export interface AccessGroup {
  pk: string,
  sk: string,
  item_type: string,
  id: string,
  activity_sid: string,
  twilio_dashboard_url: string
}

export interface Activity {
  pk: string,
  sk: string,
  item_type: string,
  activity_name: string,
  activity_sid: string,
  available: boolean
}

export interface Screenpop {
  pk: string,
  sk: string,
  item_type: string,
  id: string,
  display_name: string,
  attribute_name: boolean
}

export interface CallTag {
  display_name: string,
  options: string[]
  attribute_name: string
}

export interface DialListNumber {
  pk: string,
  sk: string,
  id: string,
  item_type: string,
  contact_num: string,
  contact_name: string,
  external_num?: string,
  profile_id: number
}

export interface DirectoryNumber {
  pk: string,
  sk: string,
  id: string,
  item_type: string,
  directory_num: string,
  first_name: string,
  last_name?: string,
  profile_id: number
}

export interface UMSoftphoneConfiguration {
    pk: string,
    sk: string,
    item_type: string,
    profile_id: number,
    ou_sid: string,
    ou_name: string,
    profile_name: string,
    overflow_skill: string,
    acw_option: boolean,
    acw_tags: boolean,
    agnt_asst_pay: boolean,
    auto_ans: boolean,
    edt_policy_num: boolean,
    edt_claim_num: boolean,
    call_reason: boolean,
    clk_to_dial: boolean,
    eft_auth: boolean,
    inbnd_rec: boolean,
    man_outbnd_rec: boolean,
    man_inbnd_rec: boolean,
    outbnd_rec: boolean,
    takes_paymnts: boolean,
    voice_mail_trans: boolean,
    fwd_to_num: string,
    transfer_queues: string[],
    backup_workers: boolean,
    call_tags: CallTag[],
    accessGroup?: AccessGroup,
    activities?: Activity[],
    dialListNumbers?: DialListNumber[],
    directoryNumbers?: DirectoryNumber[]
}

export interface AddEditSoftphoneConfigRequest {
  profile_id: number,
  ou_sid: string,
  ou_name: string,
  profile_name: string,
  overflow_skill: string,
  acw_option: boolean,
  acw_tags: boolean,
  agnt_asst_pay: boolean,
  auto_ans: boolean,
  edt_policy_num: boolean,
  edt_claim_num: boolean,
  call_reason: boolean,
  clk_to_dial: boolean,
  eft_auth: boolean,
  inbnd_rec: boolean,
  man_outbnd_rec: boolean,
  man_inbnd_rec: boolean,
  outbnd_rec: boolean,
  takes_paymnts: boolean,
  voice_mail_trans: boolean,
  fwd_to_num: string,
  transfer_queues: string[],
  backup_workers: boolean,
  call_tags: string[],
  activity_sids: string[],
  screenpop_ids: string[],
  access_group_id: string[]
}

export interface ProfilePayload {
  profile_id: null | number,
  profile_name: string,
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
  backup_workers?: string[],
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
