import { Control } from "../../../../../globals";
import { FieldConfigs } from "./Form.Field.Config";

export enum ControlEnum {
  AutoComplete = "autoComplete",
  Input = "input",
  Select = "select",
  Switch = "switch",
  MultiField = "multiField",
  MultiTextField = "multiTextField",
  TimePicker = "timePicker"
}

//TODO: Remove this class and possibly move the above enum
export class FormFieldControlManager {
  private _fieldConfigs: FieldConfigs;

  constructor(fieldConfigs: FieldConfigs) {
    this._fieldConfigs = fieldConfigs;
  }

  current(field: string): Control {
    return this._fieldConfigs[field].currentControl;
  }

  original(field: string): Control {
    return this._fieldConfigs[field].originalControl;
  }

  private to(field: string, control: Control) {
    this._fieldConfigs[field].currentControl = control;
  }

  toOriginal(field: string): void {
    this.to(field, this._fieldConfigs[field].originalControl);
  }

  toInput(field: string): void {
    this.to(field, ControlEnum.Input);
  }

  toSelect(field: string): void {
    this.to(field, ControlEnum.Select);
  }

  toAutoComplete(field: string): void {
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