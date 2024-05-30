import { Control } from "../../../../../globals";
import { FieldConfigsManager } from "./Form.FieldConfig.StateManager";
import { ControlEnum } from "./Change.Form.FieldControl";

export class FormFieldControlManager {
  private _fieldConfigsManager: FieldConfigsManager;

  constructor(formFieldConfigs: FieldConfigsManager) {
    this._fieldConfigsManager = formFieldConfigs;
  }

  current(field: string): Control {
    return this._fieldConfigsManager.get(field)?.currentControl;
  }

  original(field: string): Control {
    return this._fieldConfigsManager.get(field)?.originalControl;
  }

  private to(field: string, control: Control) {
    this._fieldConfigsManager.get(field).currentControl =  control;
  }

  toOriginal(field: string): void {
    this.to(field, this._fieldConfigsManager.get(field)?.originalControl);
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