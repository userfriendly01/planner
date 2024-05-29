import React, { useState } from "react";
import {
  FieldDataType, FieldDataTypeEnum
} from "./FormFieldConfig.State";
import { FormManager } from "./AbstractForm.Manager";

export const VALID = true;
export const NOT_VALID = false;

export interface FormHandler<RecordType> {
  get record(): RecordType;
  get modalLabel(): string;
  get modalName(): string;
  get isModalOpen(): boolean;
  get modalIsClosed(): boolean;
  get modalIsOpen(): boolean;
  closeModal(): void;
  openModal(): void;
  handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string, valuePassed?: FieldDataType): void;
  handleOnOpen: () => void;
  handleOnClone: () => void;
  handleOnSave: () => void;
  handleOnCancel: () => void;
  handleOnClose: () => void;
  handleOnDelete: () => void;
  displayCloneButton: boolean;
  displayDeleteButton: boolean;
}

export abstract class AbstractFormHandler<RecordType> implements FormHandler<RecordType> {
  private readonly _modalName: string;
  private readonly _modalLabel: string;
  private readonly _accessToken: string;
  protected readonly _formManager: FormManager<RecordType>;
  private _record: RecordType;
  private _setRecord: (record: RecordType) => void;
  private _isModalOpen = false;
  private _setIsModalOpen: (isModalOpen: boolean) => void;
  private readonly _displayCloneButton: boolean;
  private readonly _displayDeleteButton: boolean;

  constructor(modalName: string, modalLabel: string, accessToken: string, formManager: FormManager<RecordType>, displayCloneButton = false, displayDeleteButton = false) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [record, setRecord] = useState<RecordType>({ id: 0 } as RecordType);

    this._modalName = modalName;
    this._modalLabel = modalLabel;
    this._accessToken = accessToken;
    this._formManager = formManager;
    this._isModalOpen = isModalOpen;
    this._setIsModalOpen = setIsModalOpen;
    this._record = record;
    this._setRecord = setRecord;
    this._displayCloneButton = displayCloneButton;
    this._displayDeleteButton = displayDeleteButton;
  }

  protected get accessToken(): string {
    return this._accessToken;
  }

  protected get formManager(): FormManager<RecordType> {
    return this._formManager;
  }

  get displayCloneButton(): boolean {
    return this._displayCloneButton;
  }

  get displayDeleteButton(): boolean {
    return this._displayDeleteButton;
  }

  get record(): RecordType {
    return this._record;
  }

  set record(updatedRecord: RecordType) {
    this._setRecord({
      ...this.record,
      ...updatedRecord
    });
  }

  abstract handleOnOpen(): void;
  abstract handleOnSave(): void;
  abstract handleOnClone(): void;
  abstract handleOnCancel(): void;
  abstract handleOnClose(): void;
  abstract handleOnDelete(): void;

  get modalName(): string {
    return this._modalName;
  }

  get modalLabel(): string {
    return this._modalLabel;
  }

  get isModalOpen(): boolean {
    return this._isModalOpen;
  }

  set isModalOpen(isModalOpen: boolean) {
    this._setIsModalOpen(isModalOpen);
  }

  get modalIsClosed(): boolean {
    return !this._isModalOpen;
  }

  get modalIsOpen(): boolean {
    return this._isModalOpen;
  }


  closeModal(): void {
    this._setIsModalOpen(false);
  }

  openModal(): void {
    this._setIsModalOpen(true);
  }

  private _fieldValidation(key: string, value: FieldDataType): boolean {
    const fieldConfig = this.formManager.fieldConfigs.get(key);

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

  private _fieldConditionCheck(key: string): boolean {
    if (this.formManager.fieldConfigs.get(key)?.fieldConditionCheck) {
      return this.formManager.fieldConfigs.get(key).fieldConditionCheck<RecordType>(this.record);
    } else {
      // If there isn't a fieldConditionCheck, then the field condition is always valid
      return true;
    }
  }

  protected formValidation(): boolean {
    let formValidation = VALID;

    Object.keys(this._formManager.fieldConfigs.state).forEach((key: string) => {
      if (this._fieldValidation(key, this.record[key as keyof RecordType] as FieldDataType) === NOT_VALID
        && this._fieldConditionCheck(key) === VALID) { // may want to change field condition check naming to be clearer
        formValidation = NOT_VALID;
        this.formManager.fieldConfigs.setFieldValidationStatus(key, NOT_VALID);
      }
    });

    return formValidation ? VALID : NOT_VALID;
  }

  protected abstract updateRecordProperty(record: RecordType, key: string, value: FieldDataType): RecordType;

  handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, keyPassed: string, valuePassed?: FieldDataType): void {
    let key : string;
    let value: string;

    if (valuePassed && typeof valuePassed === "string") {
      key = keyPassed;
      value = valuePassed;
    } else{
      key = event.target.name;
      value = event.target.value;
    }

    const dataTypeConvertedValue = this.convertValueToDataType(value, this.formManager.fieldConfigs.get(key).dataType);

    // value = (key === "pkey" && !value.startsWith("+")) ? `+1${value}` : value;

    this.record = this.updateRecordProperty(this.record, key, dataTypeConvertedValue);
    this.formManager.fieldConfigs.setFieldValidationStatus(key,this._fieldValidation(key, value) ? VALID : NOT_VALID);
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
}