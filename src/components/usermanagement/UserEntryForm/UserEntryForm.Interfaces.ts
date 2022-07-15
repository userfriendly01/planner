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
  form: any,
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

export interface DidFormInfoProps {
  skills: TaskRouterSkill[],
  worker: Worker | null,
  workers: Worker[],
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
  setUserModalState: (payload: any) => void
}

export enum ExtensionSearchStatuses {
  Idle = 0,
  PickANumber = 1,
  WaitingForResponse = 2,
}
interface ExtensionStatusProps {
  searchStatus: ExtensionSearchStatuses,
  retriesRemaining: number,
  message?: string,
  isError?: boolean,
  originalExtension: string
}
export interface FieldState {
  value: any,
  blurred?: boolean,
  e164?: string,
  updated: boolean,
  valid?: boolean
}
export interface UserFormState {
  [index: string]: any;
  alternateDid: FieldState,
  defaultSkills: WorkerSkills,
  defaultSkillsUpdated: boolean,
  didUser: boolean,
  directDialNum: FieldState,
  editDisabled: boolean,
  extension: FieldState,
  extensionStatus: ExtensionStatusProps,
  formMode: string,
  inactiveForwardTo: FieldState,
  manager: FieldState,
  nNumber: FieldState,
  nNumberFetchedUser: FetchUserResponse,
  outgoing: FieldState,
  profileId: FieldState,
  userPreviouslyAdded: boolean,
  zeroOutEnabled: boolean,
  zeroOutEnabledUpdated: boolean
}
