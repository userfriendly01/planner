import {
  CalabrioQmUser,
  Manager,
  ModalOverlayStatuses,
  Office,
  Skill,
  TritonProfile,
  Worker,
  WorkerAttributeSkills,
  formModes
} from "globals";
import { FetchUserResponse } from "services";
import { ExtensionStatusProps } from "../Extension/ExtensionInput/ExtensionInput.Interfaces";
import { CalabrioGroup } from "..";

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
  action: UserAction,
  systems: UserSystem
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
  formMode: string,
  discrepancies: string[],
  nNumber: {
    value: any,
    blurred?: boolean,
    e164?: string,
    updated: boolean,
    valid?: boolean,
    nNumberFetchedUser: FetchUserResponse,
  }
  triton: {
    [key: string]: any,
    userFound: boolean,
    alternateDid: FieldState,
    defaultSkills: {
      updated: boolean,
      levels: {
        [key: string]: number
      },
      skills: string[]
    },
    didUser: boolean,
    directDialNum: FieldState,
    extension: {
      value: any,
      blurred?: boolean,
      e164?: string,
      updated: boolean,
      valid?: boolean,
      status: ExtensionStatusProps,
    }
    inactiveForwardTo: FieldState,
    manager: FieldState,
    outgoing: FieldState,
    profileId: FieldState,
    userPreviouslyAdded: boolean,
    zeroOutEnabled: FieldState,
    selfServiceInd: FieldState
  },
  calabrio_qm: {
    userFound: boolean,
    updated: boolean,
    id: number,
    team: CalabrioGroup,
    timezone: {
      label: string
      value: string
    },
    roles: any[],
    scope: {
      groups: CalabrioGroup[],
      teams: CalabrioGroup[]
    }
  },
  calabrio_wfm: {
    userFound: boolean
  }
}
