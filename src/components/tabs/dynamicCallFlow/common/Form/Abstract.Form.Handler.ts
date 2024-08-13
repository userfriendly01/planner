import React from "react";
import {
  FieldConfig,
  FieldConfigs,
  FieldDataType, FieldDataTypeEnum
} from "./Form.Interfaces";
import {
  DataGridControllerRef, ReactStateAction
} from "../DynamicCallFlow.Interfaces";
import { DataGridController } from "components/tabs/dynamicCallFlow/common/DataGrid/Abstract.DataGrid.Controller";
import { PhoneNumberRecordType } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { isNotArray } from "dynamicCallFlowCommon/Util/Array.Util";
import { isNotBooleanType } from "dynamicCallFlowCommon/Util/Boolean.Util";

export const VALID = true;
export const NOT_VALID = false;

export interface FormHandler<RecordType> {
  get displayDeleteButton(): boolean;
  get displayCloneButton(): boolean;
  handleOnSave: (accessToken: string, record: RecordType, fieldConfig: FieldConfigs) => Promise<FormOnHandleResponse<RecordType>>;
  handleOnDelete: (accessToken: string, record: RecordType) => Promise<FormOnHandleResponse<RecordType>>;
  get modalLabel(): string;
  get modalName(): string;
  getHtmlInputElementValue(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldConfigs: ReactStateAction<FieldConfigs>, keyPassed: string, valuePassed?: FieldDataType): FieldDataType;
}

export interface FormOnHandleResponse<RecordType> {
  record?: RecordType
  successMessage?: string;
  errorMessage?: string;
}

export abstract class AbstractFormHandler<RecordType> implements FormHandler<RecordType> {
  private readonly _dataGridController: DataGridControllerRef<RecordType>;

  constructor(dataGridController: DataGridControllerRef<RecordType>) {
    this._dataGridController = dataGridController;
  }

  get dataGridController(): DataGridController<RecordType> {
    return this._dataGridController.current;
  }

  abstract get modalName(): string;
  abstract get modalLabel(): string;

  abstract get displayCloneButton(): boolean;
  abstract get displayDeleteButton(): boolean;

  abstract handleOnSave(accessToken: string, record: RecordType, fieldConfigs: FieldConfigs): Promise<FormOnHandleResponse<RecordType>>;
  abstract handleOnDelete(accessToken: string, record: RecordType): Promise<FormOnHandleResponse<RecordType>>;

  getHtmlInputElementValue(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldConfigsReactStateAction: ReactStateAction<FieldConfigs>, keyPassed: string, valuePassed?: FieldDataType): FieldDataType {
    const {
      state: fieldConfigs,
      setState: setFieldConfigs
    } = fieldConfigsReactStateAction;
    let key : string;
    let value: FieldDataType;

    if (event?.target?.name && event?.target?.value) {
      key = event.target.name;
      value = event.target.value;
    } else {
      key = keyPassed;
      value = valuePassed;
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

  protected abstract getRecordPropertyValue(record: PhoneNumberRecordType, key: string): FieldDataType;

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
      case FieldDataTypeEnum.ARRAY:
        return (value as Array<string>).length > 0 ? VALID : NOT_VALID;
      case FieldDataTypeEnum.BOOLEAN:
        return VALID;
      default:
        return NOT_VALID;
    }
  }

  private convertValueToDataType(value: FieldDataType, fieldDataType: FieldDataTypeEnum): FieldDataType {
    // if null or undefined, then just return it.
    if (!value) {
      return value;
    }

    if (fieldDataType === FieldDataTypeEnum.ARRAY && isNotArray(value) && typeof value === "string") {
      return (value as string).split(",").map(a => a.trim()).filter(a => a.length > 0);
    } else if (fieldDataType === FieldDataTypeEnum.BOOLEAN && isNotBooleanType(value)) {
      return Boolean(value);
    } else if (fieldDataType === FieldDataTypeEnum.NUMBER && typeof value !== "number" && !isNaN(value as any)) {
      return Number(value);
    }

    return value;
  }

  validateForm(record: RecordType, fieldConfigs: FieldConfigs): void {
    const invlidFields: Array<string> = [];

    Object.keys(fieldConfigs).forEach((key: string) => {
      const fieldConfig = fieldConfigs[key];
      const value = this.getRecordPropertyValue(record as PhoneNumberRecordType, key);

      if (this._fieldValidation(value, fieldConfig) === NOT_VALID
        && fieldConfig.fieldConditionCheck(record) === VALID) {
        fieldConfig.isValid = NOT_VALID;
        invlidFields.push(key);
      }
    });

    if (invlidFields.length > 0) {
      throw new Error(`The following fields are invalid: ${invlidFields.join(", ")}`);
    }
  }
}