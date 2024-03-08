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
    valueGetter: (params: Action) => `${params?.id || ""}`,
    valueSetter: (currentValue: Action, newValue: any) => ({
      ...currentValue,
      content: {
        ...currentValue || {},
        ...newValue
      }
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
