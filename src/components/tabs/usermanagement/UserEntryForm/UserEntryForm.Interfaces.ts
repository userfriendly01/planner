import {
  Manager,
  ModalOverlayStatuses,
  Office,
  Skill,
  TritonProfile,
  Worker,
  WorkerAttributeSkills
} from "globals";
import { FetchUserResponse } from "services";

export interface LoadingState {
  lookupUser: boolean;
  overlayMessage: string;
  saveStatus: ModalOverlayStatuses;
  saveUser: boolean;
}

export interface UserEntryFormProps {
  worker: Worker | null,
  handleClose: (reopen: boolean | void) => void,
  skills: Skill[],
  workers: Worker[]
}

export interface UserFormAccordionProps {
  skills: Skill[],
  worker: Worker | null,
  workers: Worker[],
  profiles: TritonProfile[],
  managers: Manager[]
  forwardToToggle: boolean,
  setForwardToToggle: (value: boolean) => void,
}

export interface BasicFormInfoProps {
  skills: Skill[],
  worker: Worker | null,
  workers: Worker[],
  profiles: TritonProfile[],
  managers: Manager[]
  forwardToToggle: boolean,
  setForwardToToggle: (value: boolean) => void,
}

export interface DidFormInfoProps {
  skills: Skill[],
  worker: Worker | null,
  workers: Worker[],
  forwardToToggle: boolean,
  setForwardToToggle: (value: boolean) => void,
}
export interface UserFormButtonsProps {
  forwardToToggle: boolean,
  handleClose: (reopen: boolean | void) => void,
  loading: LoadingState,
  offices: Map<string, Office>,
  profiles: TritonProfile[],
  updateLoading: (payload: any) => void,
  worker: Worker | null,
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
  defaultSkills: WorkerAttributeSkills,
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
