import { formModes } from "globals";

export const initialProfileEntryFormState = {
  profileId: null,
  activitiesList: [],
  callTagsList: [],
  callTagOptions: [],
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
  transferQueues: []
};

export const validProfileEntryFormState = {
  profileId: 40,
  activitiesList: [5, 6],
  callTagsList: [],
  callTagOptions: [],
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
    value: "GRS Claims",
    updated: true,
    valid: true
  },
  transferQueues: [{skill_id: 1, skill_nme: "PSU Claims - Level 1"},{skill_id: 2, skill_nme: "PSU Claims - Level 2"}]
};

export const invalidProfileEntryFormState = {
  profileId: 40,
  activitiesList: [5, 6],
  callTagsList: [],
  callTagOptions: [],
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
  transferQueues: [{skill_id: 1, skill_nme: "PSU Claims - Level 1"},{skill_id: 2, skill_nme: "PSU Claims - Level 2"}]
};

export const initialProfileEditEntryFormState = {
  profileId: 1,
  activitiesList: [],
  callTagsList: [],
  callTagOptions: [],
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
  transferQueues: [{skill_id: 1, skill_nme: "PSU Claims - Level 1"},{skill_id: 2, skill_nme: "PSU Claims - Level 2"}]
};