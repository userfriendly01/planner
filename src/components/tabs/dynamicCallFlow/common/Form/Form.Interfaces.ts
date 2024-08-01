import { MultiFieldContainerFormProps } from "components/MultiFieldContainer";
import { Control } from "globals/interfaces";

/** null is passed when the X (clear) is chosen on a drop-down field */
export type FieldDataType = string | Array<string> | boolean | number | undefined | null;

export enum FieldDataTypeEnum {
  STRING = "string",
  STRING_ARRAY = "string-array",
  BOOLEAN = "boolean",
  NUMBER = "number"
}

export interface Fields {
  [key: string]: Field;
}

export interface Field {
  field: string;
  dataType?: FieldDataTypeEnum;
  error?: boolean;
  required?: boolean;
}

export type FieldConditionCheckType = (record: any) => boolean;
export const USER_IS_ABLE_TO_CHANGE_CONTROL = true;
export const USER_IS_NOT_ABLE_TO_CHANGE_CONTROL = false;
export type ValueGetterFunctionType<T> = (record: T, key: string) => FieldDataType;

export interface FieldConfig {
  fieldKey: string;
  label: string;
  originalControl?: Control;
  currentControl?: Control;
  isUserAbleToChangeControl?: boolean;
  required?: boolean;
  isValid: boolean;
  disableEdit?: boolean;
  dataType?: FieldDataTypeEnum;
  options?: Array<string>;
  fieldConditionCheck?: FieldConditionCheckType;
  formFields?: Array<MultiFieldContainerFormProps>;
  gridSize?: number;
}

export interface FieldConfigs {
  [fieldKey: string]: FieldConfig;
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