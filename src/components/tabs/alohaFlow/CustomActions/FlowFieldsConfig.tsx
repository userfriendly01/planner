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
    required: true,
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
    required: true,
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
    control: "autoComplete",
    required: true,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.content?.dataRequests || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      content: {
        ...currentValue.content || {},
        ...newValue
      }
    }),
    fieldType: "viewAndAdd",
    gridSize: 10
  },
  {
    label: "Caller Type",
    key: "callerType",
    control: "autoComplete",
    required: true,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.content?.callerType || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      content: {
        ...currentValue.content || {},
        ...newValue
      }
    }),
    fieldType: "viewAndAdd",
    gridSize: 10
  },
  {
    label: "Phone Number Type",
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
    label: "Transfer Destination",
    key: "transferDestination",
    control: "input",
    required: true,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.content?.transferDestination || ""}`,
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
    required: true,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.content?.callFlowRoute || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      content: {
        ...currentValue.content || {},
        ...newValue
      }
    }),
    fieldType: "viewAndAdd",
    gridSize: 10
  },
  {
    label: "Greeting",
    key: "greetingMessages",
    control: "input",
    required: true,
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
    required: false,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.userDestination || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    }),
    dynamicFieldConditionCheck: (params?: FormValidationRule): boolean=>{
      return params["type"]?.value === "DID";
    }
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
  },
  {
    label: "Call Intent",
    key: "callIntent",
    control: "input",
    required: false,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.content?.callIntent || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      content: {
        ...currentValue.content || {},
        ...newValue
      }
    })
  },
  {
    label: "Office Numbers",
    key: "officeNumbers",
    control: "multiTextField",
    required: false,
    valueGetter: (params: CctSharedCallFlowDb) => params?.content?.officeNumbers || [],
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      content: {
        ...currentValue.content || {},
        ...newValue
      }
    })
  },
  {
    label: "TFN Routing Group",
    key: "tfnRoutingGroup",
    control: "select",
    required: false,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.tfnRoutingGroup || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Predictive Caller",
    key: "predictiveCaller",
    control: "switch",
    required: false,
    valueGetter: (params: CctSharedCallFlowDb) => params?.predictiveCaller || false,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    }),
    dynamicFieldConditionCheck: (params: FormValidationRule): boolean=>{
      return params["brand"]?.value === "Liberty Mutual" && params["channel"]?.value === "Sales" && params["type"]?.value === "DRC";
    }
  },
  {
    label: "Call Flow Type",
    key: "callFlowType",
    control: "autoComplete",
    required: false,
    valueGetter: (params: CctSharedCallFlowDb): string => params?.callFlowType ?? "",
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Call Flow Name",
    key: "callFlowName",
    control: "autoComplete",
    required: false,
    dynamicFieldConditionCheck: (params: FormValidationRule): boolean=>{
      return params["callFlowType"]?.value === "DTMF";
    },
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.callFlowName || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  },
  {
    label: "Next Action ID",
    key: "nextActionId",
    control: "input",
    required: false,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.nextActionId || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })

  },
  {
    label: "Next Action Type",
    key: "nextActionType",
    control: "input",
    required: false,
    valueGetter: (params: CctSharedCallFlowDb) => `${params?.nextActionType || ""}`,
    valueSetter: (currentValue: CctSharedCallFlowDb, newValue: any) => ({
      ...currentValue,
      ...newValue
    })

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
