import { CalabrioGroup } from "../components/tabs/usermanagement/OnboardNewUser/CallRecording/CallRecording.Interfaces";
import { AuthenticationProfile } from "authentication";

export interface Action {
  type: string,
  [key: string]: any
}

export const discrepancyType = {
  CALABRIO: "Calabrio",
  TRITON: "Triton"
};
export interface Discrepancy {
  message: string,
  type: string
}
export interface AppState {
  managerContext: {
    managers: Manager[]
  },
  officeContext: {
    offices: Map<string, Office>
  },
  profileContext: {
    profiles: TritonProfile[]
  },
  skillContext: {
    skills: Skill[],
    skillGroups: SkillGroup[]
  },
  userContext: {
    pingIdentity: PingIdentity,
    authenticationProfiles: AuthenticationProfile[]
  },
  workerContext: {
    workers: Worker[]
  },
  calabrioContext: {
    tenant: any,
    teams: CalabrioGroup[],
    groups: CalabrioGroup[],
    users: any[],
    roles: any[],
    wfmOrg: any[],
    wfmOptions: any[]
  },
  resettingSkills: false
}

export interface PingIdentity {
  firstName: string,
  lastName: string,
  sub: string,
  mail: string,
  groups: string[],
  aud: string,
  displayName: string,
  access_token: string,
  acr: string,
  exp: number,
  iat: number,
  iss: string,
  jti: string,
  "pi.pa.attr_exp": number,
  "pi.pa.rat": number,
  environment: string
}

export interface FormModes {
  INSERT: string,
  UPDATE: string,
  DELETE: string
}

export interface Manager {
  manager_first_name: string,
  manager_last_name: string,
  manager_n_number: string,
  manager_id?: number | string
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

export interface Office {
  office_nme: string,
  office_num: string
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
  click_to_dial_i: MySqlBoolean,
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
  activities: Array<object>,
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
  callTags: Array<object>,
  manual_recorded_i: boolean,
  acw_data_entry_i: boolean,
  manual_record_inbound_i: boolean,
  agent_assisted_pay_i: boolean,
  overflow_skill: string | null,
  policy_number_edit_i: boolean,
  voice_mail_transcription_i: boolean,
  click_to_dial_i: boolean,
  transferQueues: Array<object>,
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

export interface Worker {
  attributes: {
    contact_uri?: string,
    default_skills?: WorkerAttributeSkills,
    department_name?:string,
    department_id?:string,
    did?: string,
    disabled_skills?: WorkerAttributeSkills,
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
    profile_id?: string | number,
    roles?: string[],
    routing?: WorkerAttributeSkills,
    unique_id?: string
  },
  alternateDid?: string,
  directDialNum?: string,
  inactiveInd?: string,
  inactiveForwardTo?: string,
  inactiveForwardToType?: string,
  sid: string,
  skillsDifferent: boolean,
  zeroOutEnabled?: boolean,
  selfServiceInd?: boolean
}

export interface WorkerAttributeSkills {
  levels: {
    [key: string]: number
  },
  skills: string[]
}

export interface AzureSPA {
  accessToken: string;
  matchedGroups: string;
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

export type Control = "input" | "select" | "autoComplete" | "timePicker" | "multiField";

export interface GraphQLErrors {
  errorType:string;
  message:string;
}
