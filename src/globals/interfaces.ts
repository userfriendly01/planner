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
    dialListEntries: DialListNumber[],
    calltags: Partial<CallTag>[]
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
  id: string,
  item_type: string,
  access_group_name: string,
  twilio_dashboard_url: string,
  viewable_profiles?: any[],
  isNew: boolean
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
  attribute_name: string
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
  access_group?: AccessGroup,
  activities?: Activity[],
  screenpops?: Screenpop[]
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

export interface AccessGroupPayload {
  access_group_name: string,
  twilio_dashboard_url: string
}

export interface ProfilePayload {
  profile_id?: number
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
  ou_name: string,
  ou_sid: string,
  fwd_to_num: string,
  screenpop_ids: string[],
  access_group_id: string,
  activity_sids: string[],
  call_tags: CallTag[],
  transfer_queues: string[]
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

export interface UMTwilioAttributeSkills {
  levels: {
    [key: string]: number;
  };
  skills: string[];
}

interface UMTwilioAttributesRouting extends UMTwilioAttributeSkills {
  team?: string;
  backup_workers?: string[];
  backup_workers_active?: boolean;
  caller_states?: string[];
  sales_assoc_workers?: string[];
}

export interface UMUserTwilioAttributes {
  contact_uri?: string;
  department_name?: string;
  department_id?: string;
  caller_id?: string,
  email?: string;
  email_address?: string;
  emp_first_name?: string;
  emp_last_name?: string;
  extension?: string;
  full_name?: string;
  location?:string;
  manager_first_name?: string;
  manager_last_name?: string;
  manager_n_number?: string;
  manager?:string;
  n_number?: string;
  office_location_name?: string;
  office_location_number?: string;
  primary_dept_name?: string;
  primary_dept_number?: string;
  profile_id?: number;
  roles?: string[];
  unique_id?: string;
  agent_id?: string;
  disabled_skills?: UMTwilioAttributeSkills;
  default_skills?: UMTwilioAttributeSkills;
  routing?: UMTwilioAttributesRouting;
}

export interface UMUser extends BaseUMUser {
  twilio_attributes: UMUserTwilioAttributes;
}

export interface UpdateOrCreateUMUser extends BaseUMUser {
  twilio_attributes: string;
}

interface BaseUMUser {
  pk: string;
  ttl: number;
  subscription_update?: boolean;

  workerSid: string;          // mapped from --> worker_sid
  sid: string;                // mapped from --> worker_sid
  worker_sid: string;

  inactiveDate?: string;      // mapped from --> inactive_date
  inactive_date?: string

  inactiveForwardTo: string;  // mapped from --> inactive_forward_to
  inactive_forward_to?: string

  zeroOutEnabled: boolean;    // mapped from --> zero_out_enabled
  zero_out_enabled?: boolean;

  selfServiceInd: boolean;    // mapped from --> self_service_ind
  self_service_ind?: boolean

  operatingUnitSid: string;   // mapped from --> operating_unit_sid
  operating_unit_sid?: string;

  did?: string;
  attributes: UMUserTwilioAttributes;  // mapped from --> twilio_attributes

  // Added by us
  skillsDifferent: boolean;
  isConsole: boolean;                 // Will be true if pk contains Console
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
