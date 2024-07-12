import { formModes } from "globals";
import {
  mockSkills, mockTaskQueues
} from "./skillConsts";


export const mockProfileOperatingUnits = [
  {
    ou_name: "Claims",
    ou_sid: "OUe98d4f81e49ccf1ae16b29f8611d1b6c"
  },
  {
    ou_name: "Service",
    ou_sid: "OU94b0ff770f6278386fec5ef0b51fd021"
  },
  {
    ou_name: "Direct Distribution",
    ou_sid: "OU7e7b999348156438ba9cc09731276775"
  }
];

export const mockActivities = [
  {
    activity_name: "Offline",
    activity_sid: "5",
    available: false
  },
  {
    activity_name: "Petting Cats",
    activity_sid: "7",
    available: true
  }
];

export const mockAccessGroups = [
  {
    access_group_name: "Canon",
    twilio_dashboard_url: "https://analytics.ytica.com/dashboard.html#workspace=/gdc/workspaces/pdgson3f19xo7p6109q1v7ecfjyc5snb&dashboard=/gdc/md/pdgson3f19xo7p6109q1v7ecfjyc5snb/obj/10546934",
    id: "2hTZxPiac4Bur9tn5pafmEjag1E"
  },
  {
    access_group_name: "Comparion",
    twilio_dashboard_url: "https://analytics.ytica.com/dashboard.html#workspace=/gdc/workspaces/pdgson3f19xo7p6109q1v7ecfjyc5snb&dashboard=/gdc/md/pdgson3f19xo7p6109q1v7ecfjyc5snb/obj/10546934",
    id: "2hTZxaGxtyj53qsimUklk03smgI"
  }
];

export const mockScreenpops = [
  {
    id: "2hTaQUwxFmf2zanRlQ4lrnbkYaI",
    display_name: "Intent",
    attribute_name: "callIntent"
  },
  {
    id: "2hTaUah5ZGZ1YcxskXiQkCac9zY",
    display_name: "Claim Type",
    attribute_name: "claimType"
  }
];

export const mockCallTagOptions = [
  {
    display_name: "Negotiation Type",
    attribute_name: "negotiation_type"
  },
  {
    display_name: "Claim Number",
    attribute_name: "claim_number"
  }
];

export const mockCallTags = [
  {
    display_name: "Negotiation Type",
    attribute_name: "negotiation_type",
    options: [
      "Info Exchange",
      "Bargaining",
      "Closing"
    ]
  },
  {
    display_name: "Claim Number",
    attribute_name: "claim_number",
    options: null
  }
];
export const initialProfileEntryFormState = {
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
  callReason: false,
  clickToDial: false,
  eftAuthorization: false,
  claimNumberEdit: false,
  overflowSkill: "",
  profileName: "",
  transferQueues: [],
  accessGroup: null,
  forwardToNum: {
    value: "",
    e164: "",
    unmaskedValue: null,
    updated: false,
    valid: false
  },
  profileId: null,
  activitiesList: [],
  callTagsList: [],
  screenpops: []
};

export const validProfileEntryFormState = {
  formMode: formModes.INSERT,
  updated: true,
  profileId: 40,
  profileName: "GRS Claims",
  operatingUnit: mockProfileOperatingUnits[0],
  autoAnswered: true,
  inboundRecorded: true,
  outboundRecorded: true,
  acwOption: false,
  manualRecorded: true,
  acwDataEntry: true,
  manualRecordedInbound: false,
  agentAssistedPay: false,
  voiceMailTranscription: false,
  paymentProcessing: false,
  policyNumberEdit: false,
  callReason: false,
  clickToDial: false,
  eftAuthorization: false,
  claimNumberEdit: false,
  forwardToNum: {
    value: "(603) 851-8200",
    e164: "+16038518200",
    unmaskedValue: "6038518200",
    updated: false,
    valid: true
  },
  overflowSkill: mockSkills[0],
  transferQueues: [mockTaskQueues[0], mockTaskQueues[1]],
  activitiesList: mockActivities,
  callTagsList: mockCallTags,
  screenpops: mockScreenpops,
  accessGroup: mockAccessGroups[0]
};