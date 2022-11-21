interface FlowContent {
    callerType: string
    callFlowRoute: string
    dataRequests: [string]
    greetingMessages: string
    languageOffer: string
    transferNumber: string
}

interface DRCFlow {
    accountManager: string;
    affinityVDN: string;
    keycode: string;
    transferCode: string;
    internetPlacement: string;
    internetType: string;
    campaignType: string;
    lineOfBusiness: string;
    marketingChannel: string;
    whisper: string;
    requestID: string;
}

export interface FlowAdvanceFilter {
    channel?: Array<string>;
    brand?: Array<string>;
    callerType?: Array<string>;
    callFlowTemplate?: Array<string>;
    callFlowRoute?: Array<string>;
    pkey?: Array<string>

}
export interface CctSharedCallFlowDb {
    id: number,
    pkey: string;
    agentId?: string;
    brand?: string;
    callFlowTemplate?: string;
    channel?: string;
    content?: FlowContent;
    createTime?: string;
    dialedDescription?: string;
    employeeId?: string;
    userDestination?: string;
    DRC?: DRCFlow;
}

export interface FlowInitState {
    data?: [];
    filteredItems?: [];
    fetching?: boolean;
    selectedRow?: undefined;
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
    advanceFilter?: Array<FlowAdvanceFilter>
}

export interface FlowKeys {
    pkey?: string,
    dialedDescription?: string,
    callFlowTemplate?: string,
    channel?: string,
    brand?: string,
    languageOffer?: string,
    dataRequests: [string],
    callerType: string,
    transferNumber: string,
    callFlowRoute: string,
    greetingMessages: string,
    agentId: string,
    employeeId: string,
    accountManager: string,
    affinityVDN: string,
    keycode: string,
    transferCode: string,
    internetPlacement: string,
    internetType: string,
    campaignType: string,
    lineOfBusiness: string,
    marketingChannel: string,
    whisper: string,
    requestID: string,
    userDestination: string
}

export interface dropDownList {
    brand: string[],
    channel: string[],
    languageOffer: string[],
    userDestination: string[]
}

export interface AddFlowFieldsConfigProps {
    label: string,
    key: string,
    control: string,
    required?: boolean,
    disableEdit?: boolean
}