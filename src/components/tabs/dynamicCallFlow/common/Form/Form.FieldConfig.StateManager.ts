import { NOT_VALID } from "./Abstract.Form.Handler";
import {
  FieldConfig, FieldConfigs
} from "./Form.FieldConfig.State";
import { FormFieldControlManager } from "./Form.Field.Control.Manager";
import { FormManagerProps } from "./Abstract.Form.Manager";

export class FieldConfigsManager<RecordType> {
  private readonly _formManagerProps: FormManagerProps<RecordType>;
  private _formFieldControlManager: FormFieldControlManager;

  constructor(formManagerProps: FormManagerProps<RecordType>) {
    this._formManagerProps = formManagerProps;
    this._formFieldControlManager = new FormFieldControlManager(this);
  }

  get fieldConfigs(): FieldConfigs {
    return this._formManagerProps.fieldConfigs;
  }

  get fieldControl(): FormFieldControlManager {
    return this._formFieldControlManager;
  }

  setIsValid(key: string, validationStatus: boolean): void {
    this.fieldConfigs[key].isValid = validationStatus;
  }

  get(key: string): FieldConfig {
    return this.fieldConfigs[key as keyof FieldConfig];
  }

  generateErrorMessage(): string {
    let errorMessage = "Please correct the errors on the form before saving.";

    Object.keys(this.fieldConfigs).forEach((key: string) => {
      if (this.fieldConfigs[key].isValid === NOT_VALID) {
        errorMessage += `\n\t${key} is required.`;
      }
    });

    return errorMessage;
  }
}