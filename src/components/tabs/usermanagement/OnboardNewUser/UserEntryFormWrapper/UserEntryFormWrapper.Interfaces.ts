import {
  UMManager,
  ModalOverlayStatuses,
  UMOffice,
  Skill,
  TritonProfile,
  UMUser,
  WfmUser,
  UMTwilioAttributeSkills
} from "globals/interfaces";
import { FetchUserResponse } from "services/fetchUser";
import { ExtensionStatusProps } from "../Extension/ExtensionInput/ExtensionInput.Interfaces";
import { CalabrioGroup } from "usermanagement/CallRecording.Interfaces";

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

export interface UserEntryFormProps {
  handleClose: () => void
}

export interface BasicFormInfoProps {
  skills: Skill[],
  worker: UMUser | null,
  workers: UMUser[],
  profiles: TritonProfile[],
  managers: UMManager[]
}

export interface UserFormButtonsProps {
  forwardToToggle: boolean,
  handleClose: () => void,
  loading: LoadingState,
  offices: UMOffice[],
  profiles: TritonProfile[],
  updateLoading: (payload: any) => void,
  worker: UMUser | null,
  setMissingFields: (missingFields: string[]) => void
}


export interface FieldState {
  value: any,
  blurred?: boolean,
  e164?: string,
  updated: boolean,
  valid?: boolean
}

export interface UserFormState {
  [key: string]: any,
  formMode: string,
  discrepancies: string[],
  nNumber: FormNNumber
  triton: {
    [key: string]: any,
    userFound: boolean,
    attributes: any,
    defaultSkills: FormDefaultSkills,
    didUser: boolean,
    did: FieldState,
    extension: FormExtension
    inactiveForwardTo: FieldState,
    manager: FieldState,
    outgoing: FieldState,
    profileId: FieldState,
    userPreviouslyAdded: boolean,
    zeroOutEnabled: FieldState,
    selfServiceInd: FieldState
  },
  calabrio_qm: {
    [key: string]: any,
    acdId?: string,
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
  calabrio_wfm: CALABRIO_WFM
}

interface FormDefaultSkills extends UMTwilioAttributeSkills {
  updated: boolean
}
interface FormNNumber extends FieldState {
  nNumberFetchedUser: FetchUserResponse,
}
interface FormExtension extends FieldState {
  status: ExtensionStatusProps,
}
interface CALABRIO_WFM extends WfmUser {
  userFound: boolean,
  [key: string]: any
}