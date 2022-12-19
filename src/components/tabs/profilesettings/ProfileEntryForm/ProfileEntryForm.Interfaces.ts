import {
  ModalOverlayStatuses,
  Activity,
  CallTag,
  WorkerTaskInfoOptions
} from "globals";

export interface ProfileEntryFormProps {
  handleClose: (reopen: boolean | void) => void
}

export interface LoadingState {
  lookupProfile: boolean;
  overlayMessage: string;
  saveStatus: ModalOverlayStatuses;
  saveProfile: boolean;
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
  label: string,
}

export interface ProfileActivitiesSelectFieldProps {
  activitiesList: Activity[]
  setActivitiesList: (activitiesList: Activity[]) => void;
}

export interface ProfileCallTagsSelectFieldProps {
  callTagsList: CallTag[]
  workerTaskInfoOptionsList: WorkerTaskInfoOptions[]
  setCallTagsList: (callTagsList: CallTag[]) => void;
}

export interface ProfileEntryFormState {
  [index: string]: any;
  profileId: number | null,
  formMode: string,
  profileName: FieldState,
  overflowSkill: FieldState,
  activitiesList: Activity[],
  callTagsList: CallTag[],
  workerTaskInfoOptions: WorkerTaskInfoOptions[],
  autoAnswered: FieldState,
  inboundRecorded: FieldState,
  outboundRecorded: FieldState,
  manualRecorded: FieldState,
  acwDataEntry: FieldState,
  acwOption: FieldState,
  manualRecordedInbound: FieldState,
  agentAssistedPay: FieldState,
  paymentProcessing: FieldState,
  policyNumberEdit: FieldState,
  voiceMailTranscription: FieldState,
  clickToDial: FieldState
}

export interface ToggleFormField {
  fieldKey: string,
  label: string
}
