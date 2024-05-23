import { useState } from "react";
import {
  FormField, FormFieldConfig, FormFieldConfigs,
  FormFields
} from "./FormField.Interfaces";
import { AbstractReactState } from "../StateManager/AbstractReactState.Manager";

export class FormFieldsState extends AbstractReactState<FormFields> {
  private readonly originalState: FormFields;
  constructor(formFieldConfigs: FormFieldConfigs) {
    super();
    this.originalState = this.initializeFormFields(formFieldConfigs);
    const [stateAction, setStateAction] = useState<FormFields>(this.originalState);

    this.stateAction = stateAction;
    this.setStateAction = setStateAction;
  }

  private initializeFormFields(formFieldConfigs: FormFieldConfigs): FormFields {
    const formFields: FormFields = {};

    Object.keys(formFieldConfigs).forEach((key: string) => {
      const formFieldConfig: FormFieldConfig = formFieldConfigs[key];
      formFields[formFieldConfig.key] = {
        field: formFieldConfig.key,
        error: false,
        value: undefined,
        required: formFieldConfig.required || false
      } as FormField;
    });

    return formFields;
  }

  protected initialState(): FormFields {
    return this.originalState;
  }

  getFormField(key: string): FormField {
    return this.stateAction[key as keyof FormFields];
  }
}