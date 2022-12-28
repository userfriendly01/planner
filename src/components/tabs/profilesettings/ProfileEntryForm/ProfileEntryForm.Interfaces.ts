import {
  ModalOverlayStatuses,
  Activity,
  Skill,
  CallTag,
  CallTagOptions
} from "globals";

export interface ProfileEntryFormProps {
  handleClose: (reopen: boolean | void) => void
}

export interface LoadingState {
  lookupProfile: boolean,
  overlayMessage: string,
  saveStatus: ModalOverlayStatuses,
  saveProfile: boolean
}

export interface ProfileFormButtonsProps {
  handleClose: (reopen: boolean | void) => void,
  loading: LoadingState,
  updateLoading: (payload: any) => void
}

export interface FieldState {
  value: any,
  updated?: boolean,
  valid?: boolean
}

export interface TextFieldProps {
  label: string
}

export interface ProfileActivitiesSelectFieldProps {
  activitiesList: Activity[],
  setActivitiesList: (activitiesList: Activity[]) => void
}

export interface ProfileQueuesSelectFieldProps {
  transferQueues: Skill[],
  setQueueList: (transferQueues: Skill[]) => void
}

export interface ProfileCallTagsSelectFieldProps {
  callTagsList: CallTag[],
  callTagOptionsList: CallTagOptions[],
  setCallTagsList: (callTagsList: CallTag[]) => void
}

export interface ProfileEntryFormState {
  [index: string]: any
  profileId: number | null,
  formMode: string,
  profileName: FieldState,
  overflowSkill: FieldState,
  activitiesList: Activity[],
  callTagsList: CallTag[],
  callTagOptions: CallTagOptions[],
  autoAnswered: FieldState,
  inboundRecorded: FieldState,
  outboundRecorded: FieldState,
  acwOption: FieldState,
  manualRecorded: FieldState,
  acwDataEntry: FieldState,
  manualRecordedInbound: FieldState,
  agentAssistedPay: FieldState,
  paymentProcessing: FieldState,
  policyNumberEdit: FieldState,
  voiceMailTranscription: FieldState,
  clickToDial: FieldState,
  transferQueues: Skill[]
}

export interface ToggleFormField {
  fieldKey: string,
  label: string
}
