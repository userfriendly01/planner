import {
  TritonProfile,
  ModalOverlayStatuses,
  Activity
} from "globals";

export interface ProfileEntryFormProps {
  profile: TritonProfile | null,
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
  updateLoading: (payload: any) => void,
  profile: TritonProfile | null,
}

export interface FieldState {
  value: any,
  updated?: boolean,
  valid?: boolean
}

export interface ProfileFormFieldsProps {
  profile: TritonProfile
}

export interface TextFieldProps {
  label: string,
}

export interface ProfileActivitiesSelectFieldProps {
  activitiesList: Activity[]
  setActivitiesList: (activitiesList: Activity[]) => void;
}

export interface ProfileEntryFormState {
  [index: string]: any;
  profileId: number | null,
  formMode: string,
  profileName: FieldState,
  overflowSkill: FieldState,
  activitiesList: Activity[],
  autoAnswered: boolean,
  inboundRecorded: boolean,
  outboundRecorded: boolean,
  acwOption: boolean,
  manualRecorded: boolean,
  acwDataEntry: boolean,
  manualRecordedInbound: boolean,
  agentAssistedPay: boolean,
  paymentProcessing: boolean,
  policyNumberEdit: boolean,
  voiceMailTranscription: boolean,
  clickToDial: boolean
}

export interface ToggleFormField {
  fieldKey: string,
  label: string
}
