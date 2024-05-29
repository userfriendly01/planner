import { AbstractFormManager } from "../../common/Form/AbstractForm.Manager";
import { PhoneNumberRecordType } from "../GraphQL/DynamicPhoneNumber.Interfaces";
import { PhoneNumberFormFieldOptions } from "./PhoneNumberForm.FieldOptions";
import { LegacyPhoneNumberFormFieldConfigs } from "./LegacyPhoneNumberFormField.Configs";
import { FormFieldConfigState } from "../../common/Form/FormFieldConfig.State";
import { DynamicPhoneNumberFormFieldConfigs } from "./DynamicPhoneNumberFormField.Configs";
import { PhoneNumberFormType } from "./PhoneNumberForm.Modal";

export class PhoneNumberFormManager extends AbstractFormManager<PhoneNumberRecordType> {
  private readonly _formFieldConfig = new Map<PhoneNumberFormType, FormFieldConfigState>([
    [PhoneNumberFormType.Dynamic, new FormFieldConfigState(DynamicPhoneNumberFormFieldConfigs)],
    [PhoneNumberFormType.Legacy, new FormFieldConfigState(LegacyPhoneNumberFormFieldConfigs)]
  ]);

  constructor() {
    // Have to send a new FormFieldConfigState instance to the super class, can't reference the above map in the super() call.
    super(new PhoneNumberFormFieldOptions(), new FormFieldConfigState(DynamicPhoneNumberFormFieldConfigs));
  }

  switchFormType(formType: PhoneNumberFormType): void {
    this.fieldConfigs = this._formFieldConfig.get(formType) as FormFieldConfigState;
    this.fieldConfigs.reset();
  }
}