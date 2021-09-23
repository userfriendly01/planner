import {
  Manager,
  Office,
  TaskRouterSkill,
  TritonProfile,
  Worker,
  WorkerSkills
} from "globals";
import { FetchUserResponse } from "services";

export interface LoadingState {
  lookupUser: boolean;
  overlayMessage: string;
  saveStatus: string;
  saveUser: boolean;
}

export interface UserEntryFormProps {
  worker: Worker | null,
  handleClose: VoidFunction,
  skills: TaskRouterSkill[],
  workers: Worker[]
}

export interface UserFormAccordianProps {
  skills: TaskRouterSkill[],
  worker: Worker | null,
  workers: Worker[],
  profiles: TritonProfile[],
  managers: Manager[]
  forwardToToggle: boolean,
  setForwardToToggle: (value: boolean) => void,
}

export interface BasicFormInfoProps {
  skills: TaskRouterSkill[],
  worker: Worker | null,
  workers: Worker[],
  profiles: TritonProfile[],
  managers: Manager[]
  forwardToToggle: boolean,
  setForwardToToggle: (value: boolean) => void,
}
export interface UserFormButtonsProps {
  handleClose: VoidFunction,
  loading: LoadingState,
  updateLoading: (payload: any) => void
  profiles: TritonProfile[],
  offices: Map<string, Office>,
  worker: Worker | null,
  forwardToToggle: boolean,
}

export interface FieldState {
  value: string,
  blurred?: boolean,
  e164?: string,
  updated: boolean,
  valid?: boolean
}

export interface UserFormState {
  [index: string]: any;
  formMode: string,
  defaultSkills: WorkerSkills,
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