import { CalabrioGroup } from "../components/tabs/usermanagement/CallRecording/CallRecording.Interfaces";
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
  activitiesContext: {
    activities: Activity[]
  },
  skillContext: {
    skills: Skill[]
  },
  userContext: {
    pingIdentity: PingIdentity,
    authenticationProfiles: AuthenticationProfile[]
  },
  workerContext: {
    workers: Worker[],
    selectedWorkers: Worker[]
  },
  calabrioContext: {
    tenant: any,
    teams: CalabrioGroup[],
    groups: CalabrioGroup[],
    users: any[],
    roles: any[]
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
  "pi.pa.rat": number
}

export interface FormModes {
  INSERT: string,
  UPDATE: string
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

export interface TritonProfile {
  acw_data_entry_i: MySqlBoolean,
  acw_option_i: MySqlBoolean,
  agent_assisted_pay_i: MySqlBoolean,
  auto_answd_i: MySqlBoolean,
  manual_record_inbound_i: MySqlBoolean,
  manual_recorded_i: MySqlBoolean,
  otbnd_recorded_i: MySqlBoolean,
  pmt_prcsg_i: MySqlBoolean,
  profile_id: number,
  profile_nme: string,
  recorded_i: MySqlBoolean,
  row_crtn_dtm: string,
  row_updt_dtm: string,
  overflow_skill: string
}

export interface Activity {
  activity_id: number,
  activity_nme: string,
  available_i: {
    data?: number[],
    type?: string
  }
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
  zeroOutEnabled?: boolean
}

export interface WorkerAttributeSkills {
  levels: {
    [key: string]: number
  },
  skills: string[]
}