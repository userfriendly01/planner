import { FormValidationRule } from "utils/interfaces";
import { AddFlowFieldsConfigProps, CctSharedCallFlowDb } from "../../AlohaFlow.Interfaces";

const flowFields: AddFlowFieldsConfigProps[] = [
  {
    label: "Dialed Phone Number",
    key: "pkey",
    control: "input",
    required: true,
    disableEdit: true,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.pkey || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, ...newValue })
  },
  {
    label: "Description",
    key: "dialedDescription",
    control: "input",
    required: true,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.dialedDescription || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, ...newValue })
  },
  {
    label: "Call Flow Template",
    key: "callFlowTemplate",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.callFlowTemplate || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, ...newValue })
  },
  {
    label: "Channel",
    key: "channel",
    control: "select",
    required: true,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.channel || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, ...newValue })
  },
  {
    label: "Brand",
    key: "brand",
    control: "select",
    required: true,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.brand || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, ...newValue })
  },
  {
    label: "Language Offer",
    key: "languageOffer",
    control: "select",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.content?.languageOffer || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, content: { ...currentValue.content || {}, ...newValue } })
  },
  {
    label: "Data Requests",
    key: "dataRequests",
    control: "input",
    required: true,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.content?.dataRequests || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, content: { ...currentValue.content || {}, ...newValue } })
  },
  {
    label: "Caller Type",
    key: "callerType",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.content?.callerType || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, content: { ...currentValue.content || {}, ...newValue } })
  },
  {
    label: "Transfer Number",
    key: "transferNumber",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.content?.transferNumber || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, content: { ...currentValue.content || {}, ...newValue } })
  },
  {
    label: "Call Flow Route",
    key: "callFlowRoute",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.content?.callFlowRoute || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, content: { ...currentValue.content || {}, ...newValue } })
  },
  {
    label: "Greeting",
    key: "greetingMessages",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.content?.greetingMessages || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, content: { ...currentValue.content || {}, ...newValue } })
  },
  {
    label: "Agent ID",
    key: "agentId",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.agentId || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, ...newValue })
  },
  {
    label: "Employee ID",
    key: "employeeId",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.employeeId || null}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, ...newValue })
  },
  {
    label: "Account Manager",
    key: "accountManager",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.DRC?.accountManager || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, DRC: { ...currentValue.DRC || {}, ...newValue } })
  },
  {
    label: "Affinity VDN",
    key: "affinityVDN",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.DRC?.affinityVDN || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, DRC: { ...currentValue.DRC || {}, ...newValue } })
  },
  {
    label: "Keycode",
    key: "keycode",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.DRC?.keycode || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, DRC: { ...currentValue.DRC || {}, ...newValue } })
  },
  {
    label: "Transfer Code",
    key: "transferCode",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.DRC?.transferCode || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, DRC: { ...currentValue.DRC || {}, ...newValue } })
  },
  {
    label: "Internet Placement",
    key: "internetPlacement",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.DRC?.internetPlacement || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, DRC: { ...currentValue.DRC || {}, ...newValue } })
  },
  {
    label: "Internet Type",
    key: "internetType",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.DRC?.internetType || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, DRC: { ...currentValue.DRC || {}, ...newValue } })
  },
  {
    label: "Campaign Type",
    key: "campaignType",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.DRC?.campaignType || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, DRC: { ...currentValue.DRC || {}, ...newValue } })
  },
  {
    label: "Line Of Business",
    key: "lineOfBusiness",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.DRC?.lineOfBusiness || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, DRC: { ...currentValue.DRC || {}, ...newValue } })
  },
  {
    label: "Marketing Channel",
    key: "marketingChannel",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.DRC?.marketingChannel || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, DRC: { ...currentValue.DRC || {}, ...newValue } })
  },
  {
    label: "Whisper",
    key: "whisper",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.DRC?.whisper || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, DRC: { ...currentValue.DRC || {}, ...newValue } })
  },
  {
    label: "Request ID",
    key: "requestID",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.DRC?.requestID || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, DRC: { ...currentValue.DRC || {}, ...newValue } })
  },
  {
    label: "User Destination",
    key: "userDestination",
    control: "select",
    required: true,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.userDestination || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({ ...currentValue, ...newValue })
  }
];

const initRule: FormValidationRule = flowFields.reduce((a: FormValidationRule, v: AddFlowFieldsConfigProps) => ({
  ...a,
  [v.key]: {
    error: false,
    value: "",
    required: v.required || false
  }
}), {});

export {
  flowFields,
  initRule
};
