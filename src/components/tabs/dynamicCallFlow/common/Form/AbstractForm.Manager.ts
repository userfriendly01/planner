import { FormFieldControl } from "./FormField.Control";
import { FormFieldConfigState } from "./FormFieldConfig.State";
import { FieldOptionsManager } from "./AbstractForm.FieldOptions";

export interface FormManager<T> {
  get fieldControl(): FormFieldControl;

  get fieldOptions(): FieldOptionsManager<T>;

  get fieldConfigs(): FormFieldConfigState;

  resetForm(): void;
}

export abstract class AbstractFormManager<RecordType> implements FormManager<RecordType> {
  private readonly _fieldOptionsManager: FieldOptionsManager<RecordType>;
  private _fieldConfigs: FormFieldConfigState;

  constructor(fieldOptionsManager: FieldOptionsManager<RecordType>, fieldConfigs: FormFieldConfigState) {
    this._fieldOptionsManager = fieldOptionsManager;
    this._fieldConfigs = fieldConfigs;
  }

  get fieldControl(): FormFieldControl {
    return this._fieldConfigs.formFieldControl;
  }

  get fieldConfigs(): FormFieldConfigState {
    return this._fieldConfigs;
  }

  protected set fieldConfigs(fieldConfigs: FormFieldConfigState) {
    this._fieldConfigs = fieldConfigs;
  }

  get fieldOptions(): FieldOptionsManager<RecordType> {
    return this._fieldOptionsManager;
  }

  resetForm(): void {
    this.fieldConfigs.reset();
  }
}