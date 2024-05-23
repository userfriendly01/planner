import { Control } from "../../globals";
import { MultiFieldContainerFormProps } from "../../components/core/SharedComponents/MultiFieldContainer";

export type DynamicFieldConditionCheckType = (formFields: FormFields) => boolean;
export type FieldType = "viewAndAdd";
export enum FieldTypeEnum {
  VIEW_AND_ADD = "viewAndAdd"
}

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

export interface FormFieldConfig {
  key: string;
  label: string;
  control: Control;
  required?: boolean;
  disableEdit?: boolean;
  dynamicFieldConditionCheck?: DynamicFieldConditionCheckType;
  formFields?: Array<MultiFieldContainerFormProps>;
  fieldType?: FieldType;
  gridSize?: number;
}

export interface FormFieldConfigs {
  [key: string]: FormFieldConfig;
}
