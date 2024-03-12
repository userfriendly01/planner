import { FormValidationRule } from "utils/interfaces";
import {
  AddFlowFieldsConfigProps, Action
} from "../DynamicFlow.Interfaces";

const flowFields: AddFlowFieldsConfigProps[] = [
  {
    label: "ID",
    key: "pkey",
    control: "input",
    required: true,
    valueGetter: (params: Action) => `${params?.pkey || ""}`,
    valueSetter: (currentValue: Action, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "skey",
    key: "skey",
    control: "input",
    required: true,
    valueGetter: (params: Action) => `${params?.skey || ""}`,
    valueSetter: (currentValue: Action, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "action type",
    key: "actionType",
    control: "input",
    required: true,
    valueGetter: (params: Action) => `${params?.actionType || ""}`,
    valueSetter: (currentValue: Action, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "allow barge-in",
    key: "allowBargeIn",
    control: "input",
    required: false,
    valueGetter: (params: Action) => `${params?.allowBargeIn || ""}`,
    valueSetter: (currentValue: Action, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "CallFlow Name",
    key: "callFlowName",
    control: "input",
    required: true,
    valueGetter: (params: Action) => `${params?.callFlowName || ""}`,
    valueSetter: (currentValue: Action, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "Finish On Key",
    key: "finishOnKey",
    control: "input",
    required: false,
    valueGetter: (params: Action) => `${params?.finishOnKey || ""}`,
    valueSetter: (currentValue: Action, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "Max Digits",
    key: "maxDigits",
    control: "input",
    required: false,
    valueGetter: (params: Action) => `${params?.maxDigits || ""}`,
    valueSetter: (currentValue: Action, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "Min Digits",
    key: "minDigits",
    control: "input",
    required: false,
    valueGetter: (params: Action) => `${params?.minDigits || ""}`,
    valueSetter: (currentValue: Action, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "Next Action ID",
    key: "nextActionId",
    control: "input",
    required: false,
    valueGetter: (params: Action) => `${params?.nextActionId || ""}`,
    valueSetter: (currentValue: Action, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "Next Action Type",
    key: "nextActionType",
    control: "input",
    required: false,
    valueGetter: (params: Action) => `${params?.nextActionType || ""}`,
    valueSetter: (currentValue: Action, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "options",
    key: "options",
    control: "input",
    required: false,
    valueGetter: (params: Action) => `${params?.options || ""}`,
    valueSetter: (currentValue: Action, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "repeat",
    key: "repeat",
    control: "input",
    required: false,
    valueGetter: (params: Action) => `${params?.repeat || ""}`,
    valueSetter: (currentValue: Action, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "speech",
    key: "speech",
    control: "input",
    required: false,
    valueGetter: (params: Action) => `${params?.speech || ""}`,
    valueSetter: (currentValue: Action, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "timeout",
    key: "timeout",
    control: "input",
    required: false,
    valueGetter: (params: Action) => `${params?.timeout || ""}`,
    valueSetter: (currentValue: Action, newValue: any) => ({
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
