import { FieldConfigsManager } from "./Form.FieldConfig.StateManager";
import { FormFieldControlManager } from "./Form.Field.Control.Manager";
import { FieldOptions } from "./AbstractFormFieldOptionsManager";
import React from "react";
import {
  FieldConfigs, FieldDataType, FieldDataTypeEnum
} from "./Form.FieldConfig.State";
import {
  FormHandler,
  NOT_VALID, VALID
} from "./Abstract.Form.Handler";
import {
  AbstractReactState, ReactSetState
} from "../StateManager/Abstract.ReactState";

export interface FormManager<RecordType> {
  get fieldConfigsManager(): FieldConfigsManager<RecordType>;
  get fieldControl(): FormFieldControlManager;
  get record(): RecordType;
  handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string, valuePassed?: FieldDataType): void;

  reset(): void;
}

export type FormModeType = "Add" | "Edit" | "Filter" | "Preview" | "NotInUse";
export enum FormModeTypeEnum {
  Add = "Add",
  Edit = "Edit",
  Fitler = "Filter",
  Preview = "Preview",
  NotInUse = "NotInUse"
}

export function initializeFormManagerProps<RecordType>(fieldOptions: FieldOptions, fieldConfigs: FieldConfigs) {
  return {
    record: {} as RecordType,
    isFormModalOpen: false,
    formMode: FormModeTypeEnum.NotInUse,
    fieldOptions: fieldOptions,
    fieldConfigs: fieldConfigs
  } as FormManagerProps<RecordType>;
}

export interface FormManagerProps<RecordType> {
  record: RecordType;
  isFormModalOpen: boolean;
  formMode: FormModeType;
  fieldOptions: FieldOptions;
  fieldConfigs: FieldConfigs;
  saveSuccess?: boolean;
}

export abstract class AbstractFormManager<RecordType> extends AbstractReactState<FormManagerProps<RecordType>> implements FormManager<RecordType> {
  private readonly _fieldConfigsManager: FieldConfigsManager<RecordType>;
  private _formHandler: FormHandler<RecordType>;

  constructor(state: FormManagerProps<RecordType>, setState: ReactSetState<FormManagerProps<RecordType>>) {
    super(state, setState);

    this._fieldConfigsManager = new FieldConfigsManager(state);
  }

  get formHandler(): FormHandler<RecordType> {
    if (!this._formHandler) {
      throw new Error("Form Handler is not set in AbstractFormManager.  A formHandler needs to be set to use the form.");
    }

    return this._formHandler;
  }

  set record(record: RecordType) {
    this.state.record = record;
  }

  get record(): RecordType {
    return this.state.record;
  }

  get fieldControl(): FormFieldControlManager {
    return this._fieldConfigsManager.fieldControl;
  }

  get fieldConfigsManager(): FieldConfigsManager<RecordType> {
    return this._fieldConfigsManager;
  }

  set isFormModalOpen(isFormModalOpen: boolean) {
    this.state = {
      isFormModalOpen: isFormModalOpen
    } as FormManagerProps<RecordType>;
  }

  get formModalIsClosed(): boolean {
    return !this.state.isFormModalOpen;
  }

  get formModalIsOpen(): boolean {
    return this.state.isFormModalOpen;
  }

  closeFormModal(): void {
    this.state = {
      isFormModalOpen: false
    } as FormManagerProps<RecordType>;
  }

  openFormModal(formHandler: FormHandler<RecordType>): void {
    this._formHandler = formHandler;
    this.state = {
      isFormModalOpen: true
    } as FormManagerProps<RecordType>;
  }

  private _fieldValidation(key: string, value: FieldDataType): boolean {
    const fieldConfig = this._fieldConfigsManager.get(key);

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
    if (this._fieldConfigsManager.get(key)?.fieldConditionCheck) {
      return this._fieldConfigsManager.get(key).fieldConditionCheck<RecordType>(this.record);
    } else {
      // If there isn't a fieldConditionCheck, then the field condition is always valid
      return true;
    }
  }

  protected formValidation(): boolean {
    let formValidation = VALID;

    Object.keys(this._fieldConfigsManager).forEach((key: string) => {
      if (this._fieldValidation(key, this.record[key as keyof RecordType] as FieldDataType) === NOT_VALID
        && this._fieldConditionCheck(key) === VALID) { // may want to change field condition check naming to be clearer
        formValidation = NOT_VALID;
        this._fieldConfigsManager.setIsValid(key, NOT_VALID);
      }
    });

    this.refresh();
    return formValidation ? VALID : NOT_VALID;
  }

  protected abstract updateRecordProperty(record: RecordType, key: string, value: FieldDataType): void;

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

    const dataTypeConvertedValue = this.convertValueToDataType(value, this._fieldConfigsManager.get(key).dataType);

    // value = (key === "pkey" && !value.startsWith("+")) ? `+1${value}` : value;

    this.updateRecordProperty(this.record, key, dataTypeConvertedValue);

    this.fieldConfigsManager.setIsValid(key,this._fieldValidation(key, value) ? VALID : NOT_VALID);
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