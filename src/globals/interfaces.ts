import { FetchUserResponse } from "services";

export interface FormState {
  formMode: string,
  open: boolean,
  worker: TwilioWorker
}

export interface UserEntryFormProps {
  userEntryFormState: FormState,
  handleClose: VoidFunction,
  skills: TaskRouterSkill[],
  workers: TwilioWorker[]
}

export interface BasicFormInfoProps {
  skills: TaskRouterSkill[],
  worker: TwilioWorker,
  workers: TwilioWorker[],
  profiles: TritonProfile[],
  managers: Manager[]
  forwardToToggle: boolean,
  setForwardToToggle: (value: boolean) => void,
}

export interface DidFormInfoProps {
  worker: TwilioWorker,
  profiles: TritonProfile[],
}

export interface UserFormButtonsProps {
  handleClose: VoidFunction,
  loading: any,
  updateLoading: (payload: any) => void
  profiles: TritonProfile[],
  offices: Map<string, Office>,
  worker: TwilioWorker,
  forwardToToggle: boolean,
}
export interface FormModes {
  INSERT: string,
  UPDATE: string
}

export const formModes: FormModes = {
  INSERT: "insert",
  UPDATE: "update"
};

export interface ModalOverlayStatuses {
  FAIL: string,
  SAVING: string,
  SUCCESS: string
}

export interface FieldState {
  value: string,
  blurred?: boolean,
  e164?: string,
  updated: boolean,
  valid?: boolean
}

export interface UserEntryFormState {
  [index: string]: any;
  defaultSkills: TwilioWorkerSkills,
  defaultSkillsUpdated: boolean,
  didUser: boolean,
  extension: FieldState,
  inactiveForwardTo: FieldState,
  manager: FieldState,
  nNumber: FieldState,
  nNumberFetchedUser: FetchUserResponse,
  outgoing: FieldState,
  profileId: FieldState,
  alternateDid: FieldState,
  directDialNum: FieldState,
  zeroOutEnabled: boolean,
  zeroOutEnabledUpdated: boolean,
  editDisabled: boolean
}

export interface LoadingState {
  lookupUser: boolean;
  overlayMessage: string;
  saveStatus: string;
  saveUser: boolean;
}

export interface UseFormResponse {
  form: UserEntryFormState,
  handleOnBlur: (field: string) => void,
  handleNumberUpdate: (
    maskedValue: string, isValid: boolean, e164Number: string, field: string
  ) => void
  initialDefaultSkills: TwilioWorkerSkills,
  loading: LoadingState,
  updateLoading: React.Dispatch<React.SetStateAction<LoadingState>>,
  setForm: React.Dispatch<React.SetStateAction<UserEntryFormState>>
}

export interface Action {
  type: string,
  [key: string]: any
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
    taskrouterSkills: TaskRouterSkill[]
  },
  userContext: {
    pingIdentity: any // TODO type me!
  },
  workerContext: {
    workers: TwilioWorker[],
    selectedWorkers: TwilioWorker[]
  },
  resettingSkills: false
}

export interface Manager {
  manager_first_name: string,
  manager_last_name: string,
  manager_n_number: string
}

export interface Office {
  office_nme: string,
  office_num: string
}

export interface MySqlBoolean {
  data: [0 | 1],
  type: "Buffer"
}

export interface TaskRouterSkill {
  skill: string,
  levels: number[]
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

export interface TwilioWorker {
  attributes: {
    contact_uri?: string,
    default_skills?: TwilioWorkerSkills,
    did?: string,
    disabled_skills?: TwilioWorkerSkills,
    email?: string,
    email_address?: string,
    emp_first_name?: string,
    emp_last_name?: string,
    extension?: string,
    full_name?: string,
    manager_first_name?: string,
    manager_last_name?: string,
    manager_n_number?: string,
    n_number?: string,
    office_location_name?: string,
    office_location_number?: string,
    primary_dept_name?: string,
    primary_dept_number?: string,
    profile_id?: string | number,
    roles?: string[],
    routing?: TwilioWorkerSkills,
    unique_id?: string
  },
  alternateDid?: string,
  directDialNum?: string,
  inactiveForwardTo?: string,
  inactiveForwardToType?: string,
  sid: string,
  skillsDifferent: boolean,
  zeroOutEnabled?: boolean
}

export interface TwilioWorkerSkills {
  levels: {
    [key: string]: number
  },
  skills: string[]
}