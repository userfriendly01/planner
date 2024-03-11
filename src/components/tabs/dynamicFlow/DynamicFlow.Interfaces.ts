import { Control } from "globals";
import { FormValidationRule } from "utils/interfaces";
import { MultiFieldContainerFormProps } from "components/core/SharedComponents/MultiFieldContainer";
import { CctSharedCallFlowDb } from "components";

export type PreviewModalAction = "add";

export interface DynamicStateVariables {
    data?: Array<Action>;
    filteredItems?: Array<Action>;
    fetching?: boolean;
    selectedRow?: Action;
    isPreviewModalOpen?: boolean;
    previewModalAction?: PreviewModalAction;
    saveSuccess?: number;
}

export interface Action {
    pkey: string;
    skey: string;
    actionId: string;
    actionType: string;
    callFlowName: string;
    createTime: string;
    updateTime: string;
    speech: string;
    allowBargeIn: boolean
    finishOnKey: string;
    minDigits: number;
    maxDigits: number;
    timeout: number;
    repeat: any;
    nextActionType: string;
    nextActionId: string;
    options?: any;
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
