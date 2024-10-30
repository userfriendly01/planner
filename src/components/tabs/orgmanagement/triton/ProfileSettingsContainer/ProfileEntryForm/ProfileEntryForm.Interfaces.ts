import {
  ModalOverlayStatuses,
  Activity,
  CallTag,
  OperatingUnit,
  AccessGroup
} from "globals/interfaces";
import {
  Skill, TwilioQueue
} from "callflowmanagement/Skills.Interfaces";

export interface ProfileEntryFormProps {
  handleClose: () => void
}

export interface LoadingState {
  lookupProfile: boolean,
  overlayMessage: string,
  saveStatus: ModalOverlayStatuses,
  saveProfile: boolean
}

export interface ProfileFormButtonsProps {
  handleClose: () => void,
  loading: LoadingState,
  updateLoading: (payload: any) => void
}

interface FieldState {
  value: any,
  updated?: boolean,
  valid?: boolean,
  e164?: string,
  unmaskedValue?: string,
}

export interface ProfileEntryFormState {
  [index: string]: any,
  accessGroup: AccessGroup,
  activitiesList: Activity[],
  acwDataEntry: boolean,
  acwOption: boolean,
  agentAssistedPay: boolean,
  autoAnswered: boolean,
  callReason: boolean
  callTagsList: CallTag[],
  clickToDial: boolean,
  eftAuthorization: boolean,
  claimNumberEdit: boolean,
  formMode: string,
  forwardToNum: FieldState,
  inboundRecorded: boolean,
  manualRecorded: boolean,
  manualRecordedInbound: boolean,
  operatingUnit: OperatingUnit,
  outboundRecorded: boolean,
  overflowSkill: Skill,
  paymentProcessing: boolean,
  policyNumberEdit: boolean,
  profileId: number | null,
  profileName: string,
  transferQueues: TwilioQueue[],
  voiceMailTranscription: boolean,
  ftoBackup: boolean
}

export interface ToggleFormField {
  fieldKey: string,
  label: string
}