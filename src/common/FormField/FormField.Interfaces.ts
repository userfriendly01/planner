import { Control } from "../../globals";
import { MultiFieldContainerFormProps } from "../../components/core/SharedComponents/MultiFieldContainer";

export type DynamicFieldConditionCheckType = (formFields: FormFields) => boolean;

export interface FormFields {
  [key: string]: FormField;
}
export interface FormField {
  field: string;
  error?: boolean;
  value?: any;
  required?: boolean;
}

export enum ControlEnum {
  AutoComplete = "autoComplete",
  Input = "input",
  Select = "select",
  Switch = "switch",
  MultiField = "multiField",
  MultiTextField = "multiTextField",
  TimePicker = "timePicker"
}

export const USER_CAN_SWITCH_TO_INPUT_CONTROL = true;
export const USER_CANNOT_SWITCH_TO_INPUT_CONTROL = false;

export interface FormFieldConfig {
  key: string;
  label: string;
  control: Control;
  isUserAbleToSwitchToInputControl?: boolean;
  required?: boolean;
  disableEdit?: boolean;
  dynamicFieldConditionCheck?: DynamicFieldConditionCheckType;
  formFields?: Array<MultiFieldContainerFormProps>;
  gridSize?: number;
}

export interface FormFieldConfigs {
  [key: string]: FormFieldConfig;
}
