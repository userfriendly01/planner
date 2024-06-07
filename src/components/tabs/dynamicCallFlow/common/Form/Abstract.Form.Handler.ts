import React from "react";
import {
  FieldConfig,
  FieldConfigs,
  FieldDataType, FieldDataTypeEnum
} from "./Form.Field.Config";
import { ReactStateAction } from "../Container.Interfaces";

export const VALID = true;
export const NOT_VALID = false;

export interface FormHandler<RecordType> {
  get displayDeleteButton(): boolean;
  get displayCloneButton(): boolean;
  handleOnSave: (accessToken: string, record: RecordType, fieldConfig: FieldConfigs) => Promise<FormOnHandleResponse<RecordType>>;
  handleOnDelete: (accessToken: string, record: RecordType) => Promise<FormOnHandleResponse<RecordType>>;
  get modalLabel(): string;
  get modalName(): string;
  getNewFieldValue(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldConfigs: ReactStateAction<FieldConfigs>, keyPassed: string, valuePassed?: FieldDataType): FieldDataType;
}

export interface FormOnHandleResponse<RecordType> {
  record?: RecordType
  successMessage?: string;
  errorMessage?: string;
}

export abstract class AbstractFormHandler<RecordType> implements FormHandler<RecordType> {
  abstract get modalName(): string;
  abstract get modalLabel(): string;

  abstract get displayCloneButton(): boolean;
  abstract get displayDeleteButton(): boolean;

  abstract handleOnSave(accessToken: string, record: RecordType, fieldConfigs: FieldConfigs): Promise<FormOnHandleResponse<RecordType>>;
  abstract handleOnDelete(accessToken: string, record: RecordType): Promise<FormOnHandleResponse<RecordType>>;

  getNewFieldValue(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldConfigsReactStateAction: ReactStateAction<FieldConfigs>, keyPassed: string, valuePassed?: FieldDataType): FieldDataType {
    const {
      state: fieldConfigs,
      setState: setFieldConfigs
    } = fieldConfigsReactStateAction;
    let key : string;
    let value: string;

    if (valuePassed && typeof valuePassed === "string") {
      key = keyPassed;
      value = valuePassed;
    } else{
      key = event.target.name;
      value = event.target.value;
    }

    const dataTypeConvertedValue = this.convertValueToDataType(value, fieldConfigs[key].dataType);

    setFieldConfigs(prevState => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        isValid: this._fieldValidation(value, fieldConfigs[key])
      }
    }));

    return dataTypeConvertedValue;
  }

  private _fieldValidation(value: FieldDataType, fieldConfig: FieldConfig): boolean {
    if (!fieldConfig.required) {
      return VALID;
    }

    if (!value) {
      return NOT_VALID;
    }

    switch(fieldConfig.dataType) {
      case FieldDataTypeEnum.STRING:
        return (value as string).toLowerCase() !== "null" || (value as string).trim().length > 0 ? VALID : NOT_VALID;
      case FieldDataTypeEnum.STRING_ARRAY:
        return (value as Array<string>).length > 0 ? VALID : NOT_VALID;
      case FieldDataTypeEnum.BOOLEAN:
        return VALID;
      default:
        return NOT_VALID;
    }
  }

  private convertValueToDataType(value: string, fieldDataType: FieldDataTypeEnum): FieldDataType {
    switch (fieldDataType) {
      case FieldDataTypeEnum.STRING_ARRAY:
        return value?.split(",")?.map(a => a.trim())?.filter(a => a.length > 0);
      case FieldDataTypeEnum.BOOLEAN:
        return value === "true";
      case FieldDataTypeEnum.NUMBER:
        return parseInt(value);
      default:
        return value;
    }
  }

  validateForm(record: RecordType, fieldConfigs: FieldConfigs): void {
    const invlidFields: Array<string> = [];

    Object.keys(fieldConfigs).forEach((key: string) => {
      const fieldConfig = fieldConfigs[key];
      if (this._fieldValidation(record[key as keyof RecordType] as FieldDataType, fieldConfig) === NOT_VALID
        && fieldConfig.fieldConditionCheck(record) === VALID) { // may want to change field condition check naming to be clearer
        fieldConfig.isValid = NOT_VALID;
        invlidFields.push(key);
      }
    });

    if (invlidFields.length > 0) {
      throw new Error(`The following fields are invalid: ${invlidFields.join(", ")}`);
    }
  }
}