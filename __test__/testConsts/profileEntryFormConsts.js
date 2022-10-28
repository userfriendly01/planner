import { formModes } from "globals";

export const initialProfileEntryFormState = {
  profileId: null,
  activitiesList: [],
  formMode: formModes.INSERT,
  autoAnswered: true,
  inboundRecorded: true,
  outboundRecorded: true,
  acwOption: false,
  manualRecorded: false,
  acwDataEntry: false,
  manualRecordedInbound: false,
  agentAssistedPay: false,
  voiceMailTranscription: false,
  paymentProcessing: false,
  policyNumberEdit: false,
  overflowSkill: {
    value: "",
    updated: false,
    valid: true
  },
  profileName: {
    value: "",
    updated: false,
    valid: false
  }
};

export const validProfileEntryFormState = {
  profileId: 40,
  activitiesList: [5, 6],
  formMode: formModes.INSERT,
  autoAnswered: true,
  inboundRecorded: true,
  outboundRecorded: true,
  acwOption: false,
  manualRecorded: false,
  acwDataEntry: true,
  manualRecordedInbound: false,
  agentAssistedPay: false,
  voiceMailTranscription: false,
  paymentProcessing: false,
  policyNumberEdit: false,
  overflowSkill: {
    value: "validskill",
    updated: true,
    valid: true
  },
  profileName: {
    value: "Valid profile name",
    updated: true,
    valid: true
  }
};

export const invalidProfileEntryFormState = {
  profileId: 40,
  activitiesList: [5, 6],
  formMode: formModes.INSERT,
  autoAnswered: true,
  inboundRecorded: true,
  outboundRecorded: true,
  acwOption: false,
  manualRecorded: false,
  acwDataEntry: true,
  manualRecordedInbound: false,
  agentAssistedPay: false,
  voiceMailTranscription: false,
  paymentProcessing: false,
  policyNumberEdit: false,
  overflowSkill: {
    value: "validskill$$",
    updated: true,
    valid: false
  },
  profileName: {
    value: "",
    updated: true,
    valid: false
  }
};