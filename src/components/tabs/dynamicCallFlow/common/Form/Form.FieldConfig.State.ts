import { AbstractReactStateDeprecated } from "../StateManager/AbstractReactStateDeprecated";
import { ChangeFormFieldControl } from "./Change.Form.FieldControl";
import { Control } from "../../../../../globals";
import { MultiFieldContainerFormProps } from "../../../../core/SharedComponents/MultiFieldContainer";
import { NOT_VALID } from "./Abstract.Form.Handler";

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
export const USER_IS_ABLE_TO_CHANGE_CONTROL = true;
export const USER_IS_NOT_ABLE_TO_CHANGE_CONTROL = false;
export type ValueGetterFunctionType<T> = (record: T, key: string) => FieldDataType;

export interface FieldConfig {
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
  options?: Array<string>;
  fieldConditionCheck?: FieldConditionCheckType;
  formFields?: Array<MultiFieldContainerFormProps>;
  gridSize?: number;
}

export interface FieldConfigs {
  [fieldKey: string]: FieldConfig;
}

export class FormFieldConfigState extends AbstractReactStateDeprecated<FieldConfigs> {
  private _formFieldControl: ChangeFormFieldControl;

  constructor(fieldConfigs: FieldConfigs) {
    super(fieldConfigs);
    this._formFieldControl = new ChangeFormFieldControl(this);
  }

  get formFieldControl(): ChangeFormFieldControl {
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

  get(key: string): FieldConfig {
    return this.state[key as keyof Fields];
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