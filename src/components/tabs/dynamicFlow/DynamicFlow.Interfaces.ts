import { Control } from "globals";
import { FormValidationRule } from "utils/interfaces";
import { MultiFieldContainerFormProps } from "components/core/SharedComponents/MultiFieldContainer";

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
    id: string;

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
