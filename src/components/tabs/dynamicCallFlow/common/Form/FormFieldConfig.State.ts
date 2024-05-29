import { AbstractReactState } from "../StateManager/AbstractReact.State";
import { FormFieldControl } from "./FormField.Control";
import { Control } from "../../../../../globals";
import { MultiFieldContainerFormProps } from "../../../../core/SharedComponents/MultiFieldContainer";
import { NOT_VALID } from "./AbstractForm.Handler";

export type FieldDataType = string | Array<string> | boolean | number | undefined;

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

export type FieldConditionCheckType = <RecordType>(record: RecordType) => boolean;
export const USER_CAN_SWITCH_TO_INPUT_CONTROL = true;
export const USER_CANNOT_SWITCH_TO_INPUT_CONTROL = false;
export type ValueGetterFunctionType<T> = (record: T, key: string) => FieldDataType;

export interface FormFieldConfig {
  fieldKey: string;
  label: string;
  control: Control;
  originalControl?: Control;
  currentControl?: Control;
  isUserAbleToChangeControl?: boolean;
  required?: boolean;
  isValid: boolean;
  disableEdit?: boolean;
  dataType?: FieldDataTypeEnum;
  fieldConditionCheck?: FieldConditionCheckType;
  formFields?: Array<MultiFieldContainerFormProps>;
  gridSize?: number;
}

export interface FormFieldConfigs {
  [fieldKey: string]: FormFieldConfig;
}

export class FormFieldConfigState extends AbstractReactState<FormFieldConfigs> {
  private _formFieldControl: FormFieldControl;

  constructor(fieldConfigs: FormFieldConfigs) {
    super(fieldConfigs);
    this._formFieldControl = new FormFieldControl(this);
  }

  get formFieldControl(): FormFieldControl {
    return this._formFieldControl;
  }

  setFieldValidationStatus(key: string, validationStatus: boolean): void {
    this.state = {
      [key]: {
        ...this.state[key],
        isValid: validationStatus
      }
    };
  }

  get(key: string): FormFieldConfig {
    return this._state[key as keyof Fields];
  }

  generateErrorMessage(): string {
    let errorMessage = "Please correct the errors on the form before saving.";

    Object.keys(this.state).forEach((key: string) => {
      if (this.state[key].isValid === NOT_VALID) {
        errorMessage += `\n\t${key} is required.`;
      }
    });

    return errorMessage;
  }
}