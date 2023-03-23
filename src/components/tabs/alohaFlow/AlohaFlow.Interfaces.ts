export interface FlowContent {
    callerType?: string;
    callFlowRoute?: string;
    dataRequests?: Array<string>;
    greetingMessages?: string;
    languageOffer?: string;
    transferNumber?: string;
}


export interface FlowMasterData {
    channel?: Array<string>;
    brand?: Array<string>;
    callerType?: Array<string>;
    callFlowTemplate?: Array<string>;
    callFlowRoute?: Array<string>;
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
    pkey?: string;
    agentId?: string;
    brand?: string;
    callFlowTemplate?: string;
    channel?: string;
    content?: FlowContent;
    createTime?: string;
    dialedDescription?: string;
    employeeId?: string;
    userDestination?: string;
    accountManager?: string;
    affinityVDN?: string;
    callTypeDescription?: string;
    transferCode?: string;
    internetPlacement?: string;
    callDetails1?: string;
    callDetails2?: string;
    lineOfBusiness?: string;
    marketingChannel?: string;
    whisper?: string;
    requestID?: string;
    rangeIndicator?: string;
}
export interface FlowKeys {
    pkey?: string;
    dialedDescription?: string;
    callFlowTemplate?: string;
    channel?: string;
    brand?: string;
    languageOffer?: string;
    dataRequests: [string];
    callerType: string;
    transferNumber: string;
    callFlowRoute: string;
    greetingMessages: string;
    agentId: string;
    employeeId: string;
    accountManager: string;
    affinityVDN: string;
    callTypeDescription: string;
    transferCode: string;
    internetPlacement: string;
    callDetails1: string;
    callDetails2: string;
    lineOfBusiness: string;
    marketingChannel: string;
    whisper: string;
    requestID: string;
    userDestination: string;
    rangeIndicator: string;
}

export interface FlowDropDownList {
    brand: string[];
    channel: string[];
    languageOffer: string[];
    userDestination: string[];
    callerType: string[];
}

export interface AddFlowFieldsConfigProps {
    label: string;
    key: string;
    control: string;
    required?: boolean;
    disableEdit?: boolean;
    valueGetter?: (params: CctSharedCallFlowDb) => string;
    valueSetter?: (currentValue: CctSharedCallFlowDb, newValue: any) => CctSharedCallFlowDb;
}
