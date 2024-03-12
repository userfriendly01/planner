import { FormValidationRule } from "utils/interfaces";
import {
  AddFlowFieldsConfigProps,
  DynamicAction
} from "../DynamicFlow.Interfaces";

const flowFields: AddFlowFieldsConfigProps[] = [
  {
    label: "Action ID",
    key: "actionId",
    control: "input",
    required: true,
    valueGetter: (params: DynamicAction) => `${params?.actionId || ""}`,
    valueSetter: (currentValue: DynamicAction, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "action type",
    key: "actionType",
    control: "input",
    required: true,
    valueGetter: (params: DynamicAction) => `${params?.actionType || ""}`,
    valueSetter: (currentValue: DynamicAction, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "allow barge-in",
    key: "allowBargeIn",
    control: "input",
    required: false,
    valueGetter: (params: DynamicAction) => `${params?.allowBargeIn || ""}`,
    valueSetter: (currentValue: DynamicAction, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "CallFlow Name",
    key: "callFlowName",
    control: "input",
    required: true,
    valueGetter: (params: DynamicAction) => `${params?.callFlowName || ""}`,
    valueSetter: (currentValue: DynamicAction, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "Finish On Key",
    key: "finishOnKey",
    control: "input",
    required: false,
    valueGetter: (params: DynamicAction) => `${params?.finishOnKey || ""}`,
    valueSetter: (currentValue: DynamicAction, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "Max Digits",
    key: "maxDigits",
    control: "input",
    required: false,
    valueGetter: (params: DynamicAction) => `${params?.maxDigits || ""}`,
    valueSetter: (currentValue: DynamicAction, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "Min Digits",
    key: "minDigits",
    control: "input",
    required: false,
    valueGetter: (params: DynamicAction) => `${params?.minDigits || ""}`,
    valueSetter: (currentValue: DynamicAction, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "Next Action ID",
    key: "nextActionId",
    control: "input",
    required: false,
    valueGetter: (params: DynamicAction) => `${params?.nextActionId || ""}`,
    valueSetter: (currentValue: DynamicAction, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "Next Action Type",
    key: "nextActionType",
    control: "input",
    required: false,
    valueGetter: (params: DynamicAction) => `${params?.nextActionType || ""}`,
    valueSetter: (currentValue: DynamicAction, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "options",
    key: "options",
    control: "input",
    required: false,
    valueGetter: (params: DynamicAction) => `${params?.options || ""}`,
    valueSetter: (currentValue: DynamicAction, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "repeat",
    key: "repeat",
    control: "input",
    required: false,
    valueGetter: (params: DynamicAction) => `${params?.repeat || ""}`,
    valueSetter: (currentValue: DynamicAction, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "speech",
    key: "speech",
    control: "input",
    required: false,
    valueGetter: (params: DynamicAction) => `${params?.speech || ""}`,
    valueSetter: (currentValue: DynamicAction, newValue: any) => ({
      ...currentValue,
      ...newValue
    })
  }, {
    label: "timeout",
    key: "timeout",
    control: "input",
    required: false,
    valueGetter: (params: DynamicAction) => `${params?.timeout || ""}`,
    valueSetter: (currentValue: DynamicAction, newValue: any) => ({
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
