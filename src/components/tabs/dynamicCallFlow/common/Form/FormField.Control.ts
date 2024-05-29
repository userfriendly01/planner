import { Control } from "../../../../../globals";
import { FormFieldConfigState } from "./FormFieldConfig.State";

export enum ControlEnum {
  AutoComplete = "autoComplete",
  Input = "input",
  Select = "select",
  Switch = "switch",
  MultiField = "multiField",
  MultiTextField = "multiTextField",
  TimePicker = "timePicker"
}

export class FormFieldControl {
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

  private change(field: string, control: Control) {
    this._formFieldConfigs.state = {
      [field]: {
        ...this._formFieldConfigs.get(field),
        currentControl: control
      }
    };
  }

  changeToOriginal(field: string): void {
    this.change(field, this._formFieldConfigs.get(field)?.originalControl);
  }

  changeToInput(field: string): void {
    this.change(field, ControlEnum.Input);
  }

  changeToSelect(field: string): void {
    this.change(field, ControlEnum.Select);
  }

  changeToAutoComplete(field: string) {
    this.change(field, ControlEnum.AutoComplete);
  }

  changeToTimePicker(field: string): void {
    this.change(field, ControlEnum.TimePicker);
  }

  changeToMultiField(field: string): void {
    this.change(field, ControlEnum.MultiField);
  }

  changeToMultiTextField(field: string): void {
    this.change(field, ControlEnum.MultiTextField);
  }

  changeToSwitch(field: string): void {
    this.change(field, ControlEnum.Switch);
  }
}