import { formModes } from "globals";

export const initialProfileEntryFormState = {
  profileId: null,
  activitiesList: [],
  formMode: formModes.INSERT,
  autoAnswered: {
    value: true
  },
  inboundRecorded: {
    value: true
  },
  outboundRecorded: {
    value: true
  },
  acwOption: {
    value: false
  },
  manualRecorded: {
    value: false
  },
  acwDataEntry: {
    value: false
  },
  manualRecordedInbound: {
    value: false
  },
  agentAssistedPay: {
    value: false
  },
  voiceMailTranscription: {
    value: false
  },
  paymentProcessing: {
    value: false
  },
  policyNumberEdit: {
    value: false
  },
  clickToDial: {
    value: false
  },
  overflowSkill: {
    value: "",
    updated: false,
    valid: true
  },
  profileName: {
    value: "",
    updated: false,
    valid: false
  },
  queueList: []
};

export const validProfileEntryFormState = {
  profileId: 40,
  activitiesList: [5, 6],
  formMode: formModes.INSERT,
  autoAnswered: {
    value: true
  },
  inboundRecorded: {
    value: true
  },
  outboundRecorded: {
    value: true
  },
  acwOption: {
    value: false
  },
  manualRecorded: {
    value: false
  },
  acwDataEntry: {
    value: true,
    updated: true
  },
  manualRecordedInbound: {
    value: false
  },
  agentAssistedPay: {
    value: false
  },
  voiceMailTranscription: {
    value: false
  },
  paymentProcessing: {
    value: false
  },
  policyNumberEdit: {
    value: false
  },
  clickToDial: {
    value: false
  },
  overflowSkill: {
    value: "validskill",
    updated: true,
    valid: true
  },
  profileName: {
    value: "Valid profile name",
    updated: true,
    valid: true
  },
  queueList: [3, 4]
};

export const invalidProfileEntryFormState = {
  profileId: 40,
  activitiesList: [5, 6],
  formMode: formModes.INSERT,
  autoAnswered: {
    value: true
  },
  inboundRecorded: {
    value: true
  },
  outboundRecorded: {
    value: true
  },
  acwOption: {
    value: false
  },
  manualRecorded: {
    value: false
  },
  acwDataEntry: {
    value: true,
    updated: true
  },
  manualRecordedInbound: {
    value: false
  },
  agentAssistedPay: {
    value: false
  },
  voiceMailTranscription: {
    value: false
  },
  paymentProcessing: {
    value: false
  },
  policyNumberEdit: {
    value: false
  },
  clickToDial: {
    value: false
  },
  overflowSkill: {
    value: "validskill$$",
    updated: true,
    valid: false
  },
  profileName: {
    value: "",
    updated: true,
    valid: false
  },
  queueList: [3, 4]
};

export const initialProfileEditEntryFormState = {
  profileId: 1,
  activitiesList: [],
  formMode: formModes.UPDATE,
  autoAnswered: {
    value: true
  },
  inboundRecorded: {
    value: true
  },
  outboundRecorded: {
    value: true
  },
  acwOption: {
    value: false
  },
  manualRecorded: {
    value: false
  },
  acwDataEntry: {
    value: false
  },
  manualRecordedInbound: {
    value: false
  },
  agentAssistedPay: {
    value: false
  },
  voiceMailTranscription: {
    value: false
  },
  paymentProcessing: {
    value: false
  },
  policyNumberEdit: {
    value: false
  },
  clickToDial: {
    value: false
  },
  overflowSkill: {
    value: "Overflow Skill",
    updated: false,
    valid: true
  },
  profileName: {
    value: "Test Profile",
    updated: false,
    valid: true
  },
  queueList: [3, 4]
};