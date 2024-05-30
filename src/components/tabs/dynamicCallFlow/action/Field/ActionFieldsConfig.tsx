import { Control } from "../../../../../globals";
import {
  FieldConditionCheckType, FieldConfig, FieldConfigs
} from "../../common/Form/Form.FieldConfig.State";
import { ControlEnum } from "../../common/Form/Change.Form.FieldControl";

export const ActionFormFieldConfigs: FieldConfigs = {};
export const RequiredActionFormFields: Array<string> = [];

function createActionFormFieldConfig(key: string, label: string, control: Control, required: boolean, disableEdit: boolean, dynamicFieldConditionCheck?: FieldConditionCheckType, isUserAbleToSwitchToInputControl?: boolean, gridSize?: number): void {
  if (required) {
    RequiredActionFormFields.push(key);
  }

  ActionFormFieldConfigs[key] = {
    fieldKey: key,
    label,
    control,
    isUserAbleToChangeControl: isUserAbleToSwitchToInputControl || false,
    required,
    disableEdit,
    fieldConditionCheck: dynamicFieldConditionCheck,
    gridSize
  } as FieldConfig;
}

createActionFormFieldConfig("actionId", "Action ID", ControlEnum.Input, true, false);
createActionFormFieldConfig("actionType", "Action Type", ControlEnum.Input, true, false);
createActionFormFieldConfig("allowBargeIn", "Allow Barge-in", ControlEnum.Input, false, false);
createActionFormFieldConfig("callFlowName", "Callflow Name", ControlEnum.Input, true, false);
createActionFormFieldConfig("finishOnKey", "Finish on Key", ControlEnum.Input, false, false);
createActionFormFieldConfig("maxDigits", "Max Digits", ControlEnum.Input, false, false);
createActionFormFieldConfig("minDigits", "Min Digits", ControlEnum.Input, false, false);
createActionFormFieldConfig("nextActionId", "Next Action ID", ControlEnum.Input, true, false);
createActionFormFieldConfig("nextActionType", "Next Action Type", ControlEnum.Input, true, false);
createActionFormFieldConfig("options", "Options", ControlEnum.Input, false, false);
createActionFormFieldConfig("repeat", "Repeat", ControlEnum.Input, false, false);
createActionFormFieldConfig("speech", "Speech", ControlEnum.Input, false, false);
createActionFormFieldConfig("timeout", "Timeout", ControlEnum.Input, false, false);

Object.freeze(ActionFormFieldConfigs);