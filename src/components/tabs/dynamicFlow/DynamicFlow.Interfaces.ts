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
