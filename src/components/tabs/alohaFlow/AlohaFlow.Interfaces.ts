import { MultiFieldContainerFormProps } from "components/core/SharedComponents/MultiFieldContainer";
import { Control } from "globals";
import { FormValidationRule } from "utils/interfaces";

export type PreviewModalAction = "add" | "edit" | "delete"
export interface FlowContent {
    callIntent?: string;
    callerType?: string;
    callFlowRoute?: string;
    dataRequests?: Array<string>;
    greetingMessages?: string;
    languageOffer?: string;
    transferDestination?: string;
    officeNumbers?: Array<string>;
}


export interface FlowMasterData {
    brand?: Array<string>;
    callFlowName?: Array<string>;
    callFlowRoute?: Array<string>;
    callFlowTemplate?: Array<string>;
    callFlowType?: Array<string>;
    callerType?: Array<string>;
    channel?: Array<string>;
    dataRequests?: Array<string>;
    pkey?: Array<string>;
}

export interface FlowAdvanceFilter {
    channel?: string;
    brand?: string;
    callerType?: string;
    callFlowTemplate?: string;
    callFlowRoute?: string;
    pkey?: string;
}
export interface FlowStateVariables {
    data?: Array<CctSharedCallFlowDb>;
    filteredItems?: Array<CctSharedCallFlowDb>;
    advanceFilter?: FlowAdvanceFilter;
    masterData?: FlowMasterData;
    fetching?: boolean;
    selectedRow?: CctSharedCallFlowDb;
    isEditModalOpen?: boolean;
    isPreviewModalOpen?: boolean;
    previewModalAction?: PreviewModalAction;
    isAddModalOpen?: boolean;
    isAdvanceSearchModalOpen?: boolean;
    idStart?: number;
    idEnd?: number;
    maxId?: number;
    minId?: number;
    saveSuccess?: number;
}

export interface CctSharedCallFlowDb {
    id?: number;
    accountManager?: string;
    affinityVDN?: string;
    brand?: string;
    callDetails1?: string;
    callDetails2?: string;
    callFlowName?: string;
    callFlowTemplate?: string;
    callFlowType?: string;
    callTypeDescription?: string;
    channel?: string;
    content?: FlowContent;
    createTime?: string;
    dialedDescription?: string;
    employeeId?: string;
    internetPlacement?: string;
    lineOfBusiness?: string;
    marketingChannel?: string;
    nextActionId?: string;
    nextActionType?: string;
    pkey?: string;
    predictiveCaller?: boolean;
    rangeIndicator?: string;
    requestID?: string;
    tfnRoutingGroup?:string;
    transferCode?: string;
    phoneNumberType?: string;
    userDestination?: string;
    whisper?: string;
}
export interface FlowKeys {
    accountManager?: string;
    affinityVDN?: string;
    brand?: string;
    callDetails1?: string;
    callDetails2?: string;
    callerType?: string;
    callFlowRoute?: string;
    callFlowTemplate?: string;
    callTypeDescription?: string;
    channel?: string;
    content?: FlowContent;
    createTime?: string;
    dataRequests?: Array<string>;
    dialedDescription?: string;
    employeeId?: string;
    greetingMessages?: string;
    internetPlacement?: string;
    languageOffer?: string;
    officeNumbers?: Array<string>;
    lineOfBusiness?: string;
    marketingChannel?: string;
    pkey?: string;
    predictiveCaller?: boolean;
    rangeIndicator?: string;
    requestID?: string;
    tfnRoutingGroup?: string;
    transferCode?: string;
    transferDestination?: string;
    phoneNumberType?: string;
    userDestination?: string;
    whisper?: string;
}

export interface FlowDropDownList {
    brand: string[];
    channel: string[];
    languageOffer: string[];
    userDestination: string[];
    callFlowName: string[];
    callFlowRoute:string[];
    callFlowType: string[];
    callerType: string[];
    dataRequests: string[];
    nextActionType: string[];
    tfnRoutingGroup : string[];
    phoneNumberType: string[];
}

export interface AddFlowFieldsConfigProps {
    label: string;
    key: string;
    control: Control;
    required?: boolean;
    disableEdit?: boolean;
    valueGetter?: (params: CctSharedCallFlowDb) => any;
    valueSetter?: (currentValue: CctSharedCallFlowDb, newValue: any) => CctSharedCallFlowDb;
    dynamicFieldConditionCheck?: (params: FormValidationRule) => boolean;
    formFields?: Array<MultiFieldContainerFormProps>;
    fieldType?: "viewAndAdd";
    gridSize?: number;
}

export interface FlowListMasterData{
    dataRequests:Array<string>;
}

export interface ViewOrAddProps{
    callerType:boolean;
    dataRequests:boolean;
    callFlowRoute:boolean;
}
