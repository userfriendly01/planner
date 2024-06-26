import {
  ControlEnum,
  FieldConditionCheckType, FieldConfig, FieldConfigs, FieldDataTypeEnum
} from "../../common/Form/Form.Interfaces";
import { Control } from "globals/interfaces";
import { ActionRecordType } from "dynamicCallFlow/GraphQL/Action.Interfaces";

export const ActionFormFieldConfigs: FieldConfigs = {};
export const RequiredActionFormFields: Array<string> = [];

const defaultFieldConditionCheck: FieldConditionCheckType = (record: ActionRecordType): boolean => {
  return true;
};

function createFieldConfig(fieldKey: string, label: string, control: Control, required: boolean, disableEdit: boolean, dataType = FieldDataTypeEnum.STRING, fieldConditionCheck?: FieldConditionCheckType, isUserAbleToChangeControl = false, gridSize?: number): void {
  if (required) {
    RequiredActionFormFields.push(fieldKey);
  }

  ActionFormFieldConfigs[fieldKey] = {
    fieldKey: fieldKey,
    label,
    originalControl: control,
    currentControl: control,
    isUserAbleToChangeControl: isUserAbleToChangeControl || false,
    required,
    disableEdit,
    dataType,
    fieldConditionCheck: fieldConditionCheck || defaultFieldConditionCheck,
    gridSize
  } as FieldConfig;
}

createFieldConfig("actionId", "Action ID", ControlEnum.Input, true, false);
createFieldConfig("actionType", "Action Type", ControlEnum.AutoComplete, true, false);
createFieldConfig("allowBargeIn", "Allow Barge-in", ControlEnum.Input, false, false);
createFieldConfig("callFlowName", "Call Flow Name", ControlEnum.Input, true, false);
createFieldConfig("finishOnKey", "Finish on Key", ControlEnum.Input, false, false);
createFieldConfig("maxDigits", "Max Digits", ControlEnum.Input, false, false);
createFieldConfig("minDigits", "Min Digits", ControlEnum.Input, false, false);
createFieldConfig("nextActionId", "Next Action ID", ControlEnum.Input, true, false);
createFieldConfig("nextActionType", "Next Action Type", ControlEnum.AutoComplete, true, false);
createFieldConfig("options", "Options", ControlEnum.Input, false, false);
createFieldConfig("repeat", "Repeat", ControlEnum.Input, false, false);
createFieldConfig("speech", "Speech", ControlEnum.Input, false, false);
createFieldConfig("timeout", "Timeout", ControlEnum.Input, false, false);

Object.freeze(ActionFormFieldConfigs);