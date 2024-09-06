import {
  ControlEnum,
  FieldConditionCheckType, FieldConfig, FieldConfigs, FieldDataTypeEnum
} from "components/tabs/dynamicCallFlow/common/Form/Form.Interfaces";
import { Control } from "globals/interfaces";

export const ActionFormFieldConfigs: FieldConfigs = {};
export const RequiredActionFormFields: Array<string> = [];

export const defaultFieldConditionCheck: FieldConditionCheckType = (): boolean => {
  return true;
};

export function createFieldConfig(fieldKey: string, label: string, control: Control): void {
  ActionFormFieldConfigs[fieldKey] = {
    fieldKey: fieldKey,
    label,
    originalControl: control,
    currentControl: control,
    isUserAbleToChangeControl: false,
    required: false,
    disableEdit: true,
    dataType: FieldDataTypeEnum.STRING,
    fieldConditionCheck: defaultFieldConditionCheck
  } as FieldConfig;
}

createFieldConfig("actionId", "Action ID", ControlEnum.Input);
createFieldConfig("actionType", "Action Type", ControlEnum.AutoComplete);
createFieldConfig("allowBargeIn", "Allow Barge-in", ControlEnum.Input);
createFieldConfig("callFlowName", "Call Flow Name", ControlEnum.Input);
createFieldConfig("finishOnKey", "Finish on Key", ControlEnum.Input);
createFieldConfig("maxDigits", "Max Digits", ControlEnum.Input);
createFieldConfig("minDigits", "Min Digits", ControlEnum.Input);
createFieldConfig("nextActionId", "Next Action ID", ControlEnum.Input);
createFieldConfig("nextActionType", "Next Action Type", ControlEnum.AutoComplete);
createFieldConfig("options", "Options", ControlEnum.Input);
createFieldConfig("repeat", "Repeat", ControlEnum.Input);
createFieldConfig("speech", "Speech", ControlEnum.Input);
createFieldConfig("timeout", "Timeout", ControlEnum.Input);

Object.freeze(ActionFormFieldConfigs);