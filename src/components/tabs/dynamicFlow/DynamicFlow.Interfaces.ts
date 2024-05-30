import { Control } from "globals";
import { FormValidationRule } from "utils/interfaces";
import { MultiFieldContainerFormProps } from "components/core/SharedComponents/MultiFieldContainer";

export type PreviewModalAction = "add" | "delete";

export type ActionType = "MENU"|"MENUOPTIONS"|"ANNOUNCEMENT"|"TRANSFER"|"HANGUP";
export interface Action {
    id: number;
    actionId: string;
    actionType: ActionType;
    callFlowName: string;
    createTime: string;
    updateTime: string;
}

export interface DynamicStateVariables {
    data?: Array<Action>;
    filteredItems?: Array<DynamicAction>;
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
    valueGetter?: (params: DynamicAction) => any;
    valueSetter?: (currentValue: DynamicAction, newValue: any) => DynamicAction;
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
    valueGetter?: (params: DynamicAction) => any;
    valueSetter?: (currentValue: DynamicAction, newValue: any) => DynamicAction;
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

export interface DynamicFlowStateVariables {
    data?: Array<DynamicAction>;
    filteredItems?: Array<DynamicAction>;
    masterData?: any;
    fetching?: boolean;
    selectedRow?: DynamicAction;
    isPreviewModalOpen?: boolean;
    previewModalAction?: PreviewModalAction;
    idStart?: number;
    idEnd?: number;
    maxId?: number;
    minId?: number;
    saveSuccess?: number;
}

export type DynamicAction = Menu & MenuOptions & Announcement;
export interface ActionPreview extends DynamicAction {
    errors?: string;
}
