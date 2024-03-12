import { Control } from "globals";
import { FormValidationRule } from "utils/interfaces";
import { MultiFieldContainerFormProps } from "components/core/SharedComponents/MultiFieldContainer";

export type PreviewModalAction = "add";

export type ActionType = "MENU"|"MENUOPTIONS"|"ANNOUNCEMENT"|"TRANSFER"|"HANGUP";
export interface Action {
    actionId: string;
    actionType: ActionType;
    callFlowName: string;
    createTime: string;
    updateTime: string;
}

export interface DynamicStateVariables {
    data?: Array<Action>;
    filteredItems?: Array<Action>;
    fetching?: boolean;
    selectedRow?: Action;
    isPreviewModalOpen?: boolean;
    previewModalAction?: PreviewModalAction;
    saveSuccess?: number;
}

export interface AddFlowFieldsConfigProps {
    label: string;
    key: string;
    control: Control;
    required?: boolean;
    disableEdit?: boolean;
    valueGetter?: (params: Action) => any;
    valueSetter?: (currentValue: Action, newValue: any) => Action;
    dynamicFieldConditionCheck?: (params: FormValidationRule) => boolean;
    formFields?: Array<MultiFieldContainerFormProps>;
    fieldType?: "viewAndAdd";
    gridSize?: number;
}

export interface AddDynamicFlowFieldsConfigProps {
    label: string;
    key: string;
    control: Control;
    required?: boolean;
    disableEdit?: boolean;
    valueGetter?: (params: Action) => any;
    valueSetter?: (currentValue: Action, newValue: any) => Action;
    dynamicFieldConditionCheck?: (params: FormValidationRule) => boolean;
    formFields?: Array<MultiFieldContainerFormProps>;
    fieldType?: "viewAndAdd";
    gridSize?: number;
}

export interface MenuOption {
    digit: string
    callerContextAttributes?: any
    nextActionType: ActionType
    nextActionId?: string
}

export interface Announcement extends Action {
    speech: string
    nextActionType: ActionType
    nextActionId?: string
}
export interface MenuOptions extends Action {
    options: MenuOption[]
}

export interface Repeat {
    callerContextAttributes?: any
    loop?: number
    nextActionType: ActionType
    nextActionId?: string
}

export interface Menu extends Action {
    speech: string
    allowBargeIn?: boolean
    finishOnKey?: string
    minDigits?: number
    maxDigits?: number
    timeout?: number
    repeat?: Repeat
    nextActionType: ActionType
    nextActionId?: string
  }

export type DynamicAction = Menu & MenuOptions & Announcement;
export interface ActionPreview extends DynamicAction {
    errors: string;
}
