import {
  ModalOverlayStatuses,
  Activity,
  Skill,
  CallTag,
  CallTagOptions,
  OperatingUnit
} from "globals";

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
  [index: string]: any,
  accessGroup: FieldState,
  accessGroupId: number | null,
  activitiesList: Activity[],
  acwDataEntry: FieldState,
  acwOption: FieldState,
  agentAssistedPay: FieldState,
  autoAnswered: FieldState,
  callTagOptions: CallTagOptions[],
  callTagsList: CallTag[],
  clickToDial: FieldState,
  eftAuthorization: FieldState,
  formMode: string,
  inboundRecorded: FieldState,
  manualRecorded: FieldState,
  manualRecordedInbound: FieldState,
  operatingUnit: OperatingUnit,
  outboundRecorded: FieldState,
  overflowSkill: FieldState,
  paymentProcessing: FieldState,
  policyNumberEdit: FieldState,
  profileId: number | null,
  profileName: FieldState,
  transferQueues: Skill[],
  voiceMailTranscription: FieldState,
}

export interface ToggleFormField {
  fieldKey: string,
  label: string
}

export interface ProfileOperatingUnitFieldProps {
  setOperatingUnit: (ou: OperatingUnit) => void
}

export interface ProfileAccessGroupFieldProps {
  enableDropDown: boolean,
  accessGroupId: number,
  setAccessGroupId: (accessGroupId: number) => void
}