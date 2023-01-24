import {
  CalabrioQmUser,
  Manager,
  ModalOverlayStatuses,
  Office,
  Skill,
  TritonProfile,
  Worker,
  WorkerAttributeSkills
} from "globals";
import { FetchUserResponse } from "services";
import { View } from "../../UserManagementWrapper/UserManagement.Interfaces";
import { ExtensionStatusProps } from "../Extension/ExtensionInput/ExtensionInput.Interfaces";

export interface LoadingState {
  lookupUser: boolean;
  overlayMessage: string;
  saveStatus: ModalOverlayStatuses;
  saveUser: boolean;
}

export enum UserAction {
  ADD = "add",
  EDIT = "edit",
  DELETE = "delete"
}

export interface UserSystem {
  triton: boolean,
  calabrio_qm: boolean,
  calabrio_wfm: boolean
}

export interface WorkerOpts {
  worker: any,
  action: UserAction,
  systems: UserSystem,
  routedFrom: View
}

export interface UserEntryFormProps {
  workerOpts: WorkerOpts,
  setWorkerOpts: (opts: WorkerOpts) => void,
  handleClose: () => void
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
  worker: Worker | null,
  forwardToToggle: boolean,
  setForwardToToggle: (value: boolean) => void,
}
export interface UserFormButtonsProps {
  forwardToToggle: boolean,
  handleClose: () => void,
  loading: LoadingState,
  offices: Map<string, Office>,
  profiles: TritonProfile[],
  updateLoading: (payload: any) => void,
  worker: Worker | null,
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
