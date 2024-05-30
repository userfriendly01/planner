import { Control } from "../../../../../globals";
import { FormFieldConfigState } from "./Form.FieldConfig.State";

export enum ControlEnum {
  AutoComplete = "autoComplete",
  Input = "input",
  Select = "select",
  Switch = "switch",
  MultiField = "multiField",
  MultiTextField = "multiTextField",
  TimePicker = "timePicker"
}

export class ChangeFormFieldControl {
  private _formFieldConfigs: FormFieldConfigState;

  constructor(formFieldConfigs: FormFieldConfigState) {
    this._formFieldConfigs = formFieldConfigs;
  }

  current(field: string): Control {
    return this._formFieldConfigs.get(field)?.currentControl;
  }

  original(field: string): Control {
    return this._formFieldConfigs.get(field)?.originalControl;
  }

  private to(field: string, control: Control) {
    this._formFieldConfigs.state = {
      [field]: {
        ...this._formFieldConfigs.get(field),
        currentControl: control
      }
    };
  }

  toOriginal(field: string): void {
    this.to(field, this._formFieldConfigs.get(field)?.originalControl);
  }

  toInput(field: string): void {
    this.to(field, ControlEnum.Input);
  }

  toSelect(field: string): void {
    this.to(field, ControlEnum.Select);
  }

  toAutoComplete(field: string) {
    this.to(field, ControlEnum.AutoComplete);
  }

  toTimePicker(field: string): void {
    this.to(field, ControlEnum.TimePicker);
  }

  toMultiField(field: string): void {
    this.to(field, ControlEnum.MultiField);
  }

  toMultiTextField(field: string): void {
    this.to(field, ControlEnum.MultiTextField);
  }

  toSwitch(field: string): void {
    this.to(field, ControlEnum.Switch);
  }
}