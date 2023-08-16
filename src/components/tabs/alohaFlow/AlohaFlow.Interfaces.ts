import { Control } from "globals";
import { FormValidationRule } from "utils/interfaces";
export interface FlowContent {
    callIntent?: string;
    callerType?: string;
    callFlowRoute?: string;
    dataRequests?: Array<string>;
    greetingMessages?: string;
    languageOffer?: string;
    transferNumber?: string;
    officeNumber?: string;
}


export interface FlowMasterData {
    channel?: Array<string>;
    brand?: Array<string>;
    callerType?: Array<string>;
    callFlowTemplate?: Array<string>;
    callFlowRoute?: Array<string>;
    pkey?: Array<string>;
    dataRequests?: Array<string>;
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
    isAddModalOpen?: boolean;
    isAdvanceSearchModalOpen?: boolean;
    idStart?: number;
    idEnd?: number;
    maxId?: number;
    minId?: number;
    saveSuccess?: number;
    page?: number;
    perPage?: number;
}

export interface CctSharedCallFlowDb {
    id?: number;
    accountManager?: string;
    affinityVDN?: string;
    agentId?: string;
    brand?: string;
    callDetails1?: string;
    callDetails2?: string;
    callFlowTemplate?: string;
    callTypeDescription?: string;
    channel?: string;
    content?: FlowContent;
    createTime?: string;
    dialedDescription?: string;
    employeeId?: string;
    internetPlacement?: string;
    lineOfBusiness?: string;
    marketingChannel?: string;
    pkey?: string;
    rangeIndicator?: string;
    requestID?: string;
    tollFreeNumber?: string;
    transferCode?: string;
    type?: string;
    userDestination?: string;
    whisper?: string;
}
export interface FlowKeys {
    accountManager?: string;
    affinityVDN?: string;
    agentId?: string;
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
    officeNumber?: string;
    lineOfBusiness?: string;
    marketingChannel?: string;
    pkey?: string;
    rangeIndicator?: string;
    requestID?: string;
    tollFreeNumber?: string;
    transferCode?: string;
    transferNumber?: string;
    type?: string;
    userDestination?: string;
    whisper?: string;
}

export interface FlowDropDownList {
    brand: string[];
    channel: string[];
    languageOffer: string[];
    userDestination: string[];
    callFlowRoute:string[];
    callerType: string[];
    dataRequests: string[];
    type: string[];
}

export interface AddFlowFieldsConfigProps {
    label: string;
    key: string;
    control: Control;
    required?: boolean;
    disableEdit?: boolean;
    valueGetter?: (params: CctSharedCallFlowDb) => string;
    valueSetter?: (currentValue: CctSharedCallFlowDb, newValue: any) => CctSharedCallFlowDb;
    dynamicFieldConditionCheck?: (params: FormValidationRule) => boolean
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
