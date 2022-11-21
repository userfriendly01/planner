import { AddFlowFieldsConfigProps } from "../AlohaFlow.Interfaces";

const mandatoryFields: string[] = [
  "brand",
  "channel",
  "dataRequests",
  "dialedDescription",
  "pkey"
];

const flowFields: AddFlowFieldsConfigProps[] = [
  {
    label: "Dialed Phone Number",
    key: "pkey",
    control: "input",
    required: true,
    disableEdit: true
  },
  {
    label: "Description",
    key: "dialedDescription",
    control: "input",
    required: true
  },
  {
    label: "Call Flow Template",
    key: "callFlowTemplate",
    control: "input"
  },
  {
    label: "Channel",
    key: "channel",
    control: "select",
    required: true
  },
  {
    label: "Brand",
    key: "brand",
    control: "select",
    required: true
  },
  {
    label: "Language Offer",
    key: "languageOffer",
    control: "select"
  },
  {
    label: "Data Requests",
    key: "dataRequests",
    control: "input",
    required: true
  },
  {
    label: "Caller Type",
    key: "callerType",
    control: "input"
  },
  {
    label: "Transfer Number",
    key: "transferNumber",
    control: "input"
  },
  {
    label: "Call Flow Route",
    key: "callFlowRoute",
    control: "input"
  },
  {
    label: "Greeting",
    key: "greetingMessages",
    control: "input"
  },
  {
    label: "Agent ID",
    key: "agentId",
    control: "input"
  },
  {
    label: "Employee ID",
    key: "employeeId",
    control: "input"
  },
  {
    label: "Account Manager",
    key: "accountManager",
    control: "input"
  },
  {
    label: "Affinity VDN",
    key: "affinityVDN",
    control: "input"
  },
  {
    label: "Keycode",
    key: "keycode",
    control: "input"
  },
  {
    label: "Transfer Code",
    key: "transferCode",
    control: "input"
  },
  {
    label: "Internet Placement",
    key: "internetPlacement",
    control: "input"
  },
  {
    label: "Internet Type",
    key: "internetType",
    control: "input"
  },
  {
    label: "Campaign Type",
    key: "campaignType",
    control: "input"
  },
  {
    label: "Line Of Business",
    key: "lineOfBusiness",
    control: "input"
  },
  {
    label: "Marketing Channel",
    key: "marketingChannel",
    control: "input"
  },
  {
    label: "Whisper",
    key: "whisper",
    control: "input"
  },
  {
    label: "Request ID",
    key: "requestID",
    control: "input"
  },
  {
    label: "User Destination",
    key: "userDestination",
    control: "select"
  }
];

const initRule: any = flowFields.reduce((a, v) => ({
  ...a,
  [v.key]: {
    error: false,
    value: "",
    required: v.required || false
  }
}), {});

export {
  flowFields,
  initRule,
  mandatoryFields
};
