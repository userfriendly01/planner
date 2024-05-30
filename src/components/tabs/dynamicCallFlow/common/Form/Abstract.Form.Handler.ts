import React from "react";
import {
  FieldDataType, FieldDataTypeEnum
} from "./Form.FieldConfig.State";
import {
  FormManager, FormModeType
} from "./Abstract.Form.Manager";
import {
  AbstractReactState, ReactSetState
} from "../StateManager/Abstract.ReactState";

export const VALID = true;
export const NOT_VALID = false;

export interface FormHandler<RecordType> {
  formMode: FormModeType;
  get displayDeleteButton(): boolean;
  get displayCloneButton(): boolean;
  handleOnOpen: () => void;
  handleOnClone: () => void;
  handleOnSave: () => void;
  handleOnCancel: () => void;
  handleOnClose: () => void;
  handleOnDelete: () => void;
  get modalLabel(): string;
  get modalName(): string;
}

// export interface FormHandlerProps<RecordType> {
// }

export abstract class AbstractFormHandler<RecordType> implements FormHandler<RecordType> {
  private readonly _accessToken: string;
  private readonly _formManager: FormManager<RecordType>;

  protected constructor(accessToken: string, formManager: FormManager<RecordType>) { //, state: FormHandlerProps<RecordType>, setState: ReactSetState<FormHandlerProps<RecordType>>) {
    // super(state, setState);

    this._accessToken = accessToken;
    this._formManager = formManager;
  }

  protected get accessToken(): string {
    return this._accessToken;
  }

  protected get formManager(): FormManager<RecordType> {
    return this._formManager;
  }

  abstract get modalName(): string;
  abstract get modalLabel(): string;
  abstract get formMode(): FormModeType;

  abstract get displayCloneButton(): boolean;
  abstract get displayDeleteButton(): boolean;

  abstract handleOnOpen(): void;
  abstract handleOnSave(): void;
  abstract handleOnClone(): void;
  abstract handleOnCancel(): void;
  abstract handleOnClose(): void;
  abstract handleOnDelete(): void;

}