import { FormValidationRule } from "utils/interfaces";
import {
  AddFlowFieldsConfigProps, CctSharedCallFlowDb
} from "../AlohaFlow.Interfaces";

const flowFields: AddFlowFieldsConfigProps[] = [
  {
    label: "Dialed Phone Number",
    key: "pkey",
    control: "input",
    required: true,
    disableEdit: true,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.pkey || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Description",
    key: "dialedDescription",
    control: "input",
    required: true,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.dialedDescription || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Call Flow Template",
    key: "callFlowTemplate",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.callFlowTemplate || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Channel",
    key: "channel",
    control: "select",
    required: true,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.channel || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Brand",
    key: "brand",
    control: "select",
    required: true,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.brand || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Language Offer",
    key: "languageOffer",
    control: "select",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.content?.languageOffer || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      content: {
        ...currentValue.content || {},
        ...newValue
      }
    })
  },
  {
    label: "Data Requests",
    key: "dataRequests",
    control: "input",
    required: false,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.content?.dataRequests || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      content: {
        ...currentValue.content || {},
        ...newValue
      }
    })
  },
  {
    label: "Caller Type",
    key: "callerType",
    control: "autoComplete",
    required: false,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.content?.callerType || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      content: {
        ...currentValue.content || {},
        ...newValue
      }
    })
  },
  {
    label: "Type",
    key: "type",
    control: "autoComplete",
    required: false,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.type || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Transfer Number",
    key: "transferNumber",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.content?.transferNumber || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      content: {
        ...currentValue.content || {},
        ...newValue
      }
    })
  },
  {
    label: "Call Flow Route",
    key: "callFlowRoute",
    control: "autoComplete",
    required: false,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.content?.callFlowRoute || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      content: {
        ...currentValue.content || {},
        ...newValue
      }
    })
  },
  {
    label: "Greeting",
    key: "greetingMessages",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.content?.greetingMessages || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      content: {
        ...currentValue.content || {},
        ...newValue
      }
    })
  },
  {
    label: "Agent ID",
    key: "agentId",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.agentId || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Employee ID",
    key: "employeeId",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.employeeId || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Account Manager",
    key: "accountManager",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.accountManager || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    }),
    dynamicFieldConditionCheck: (params: FormValidationRule): boolean=>{
      return params["brand"]?.value === "Liberty Mutual" && params["channel"]?.value === "Sales" && params["type"]?.value === "DRC";
    }
  },
  {
    label: "Affinity VDN",
    key: "affinityVDN",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.affinityVDN || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    }),
    dynamicFieldConditionCheck: (params: FormValidationRule): boolean=>{
      return params["brand"]?.value === "Liberty Mutual" && params["channel"]?.value === "Sales" && params["type"]?.value === "DRC";
    }
  },
  {
    label: "Call Type Description",
    key: "callTypeDescription",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.callTypeDescription || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Transfer Code",
    key: "transferCode",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.transferCode || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    }),
    dynamicFieldConditionCheck: (params: FormValidationRule): boolean=>{
      return params["brand"]?.value === "Liberty Mutual" && params["channel"]?.value === "Sales" && params["type"]?.value === "DRC";
    }
  },
  {
    label: "Internet Placement",
    key: "internetPlacement",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.internetPlacement || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    }),
    dynamicFieldConditionCheck: (params: FormValidationRule): boolean=>{
      return params["brand"]?.value === "Liberty Mutual" && params["channel"]?.value === "Sales" && params["type"]?.value === "DRC";
    }
  },
  {
    label: "Call Details 1",
    key: "callDetails1",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.callDetails1 || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    }),
    dynamicFieldConditionCheck: (params: FormValidationRule): boolean=>{
      return params["brand"]?.value === "Liberty Mutual" && params["channel"]?.value === "Sales" && params["type"]?.value === "DRC";
    }
  },
  {
    label: "Call Details 2",
    key: "callDetails2",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.callDetails2 || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    }),
    dynamicFieldConditionCheck: (params: FormValidationRule): boolean=>{
      return params["brand"]?.value === "Liberty Mutual" && params["channel"]?.value === "Sales" && params["type"]?.value === "DRC";
    }
  },
  {
    label: "Line Of Business",
    key: "lineOfBusiness",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.lineOfBusiness || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    }),
    dynamicFieldConditionCheck: (params: FormValidationRule): boolean=>{
      return params["brand"]?.value === "Liberty Mutual" && params["channel"]?.value === "Sales" && params["type"]?.value === "DRC";
    }
  },
  {
    label: "Marketing Channel",
    key: "marketingChannel",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.marketingChannel || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    }),
    dynamicFieldConditionCheck: (params: FormValidationRule): boolean=>{
      return params["brand"]?.value === "Liberty Mutual" && params["channel"]?.value === "Sales" && params["type"]?.value === "DRC";
    }
  },
  {
    label: "Toll Free Number",
    key: "tollFreeNumber",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.tollFreeNumber || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Whisper",
    key: "whisper",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.whisper || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    }),
    dynamicFieldConditionCheck: (params: FormValidationRule): boolean=>{
      return params["brand"]?.value === "Liberty Mutual" && params["channel"]?.value === "Sales" && params["type"]?.value === "DRC";
    }
  },
  {
    label: "Request ID",
    key: "requestID",
    control: "input",
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.requestID || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    }),
    dynamicFieldConditionCheck: (params: FormValidationRule): boolean=>{
      return params["brand"]?.value === "Liberty Mutual" && params["channel"]?.value === "Sales" && params["type"]?.value === "DRC";
    }
  },
  {
    label: "User Destination",
    key: "userDestination",
    control: "select",
    required: true,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.userDestination || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Range Indicator",
    key: "rangeIndicator",
    control: "input",
    required: false,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.rangeIndicator || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    }),
    dynamicFieldConditionCheck: (params: FormValidationRule): boolean=>{
      return params["brand"]?.value === "Liberty Mutual" && params["channel"]?.value === "Sales" && params["type"]?.value === "DRC";
    }
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
