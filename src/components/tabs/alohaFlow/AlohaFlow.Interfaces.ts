interface FlowContent {
    callerType: String
    callFlowRoute: String
    dataRequests: [String]
    greetingMessages: String
    languageOffer: String
    transferNumber: String
}

interface DRCFlow {
    accountManager: String;
    affinityVDN: String;
    keycode: String;
    transferCode: String;
    internetPlacement: String;
    internetType: String;
    campaignType: String;
    lineOfBusiness: String;
    marketingChannel: String;
    whisper: String;
    requestID: String;
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
    id:number,
    pkey: String;
    agentId?: String;
    brand?: String;
    callFlowTemplate?: String;
    channel?: String;
    content?: FlowContent;
    createTime?: String;
    dialedDescription?: String;
    employeeId?: String;
    userDestination?: String;
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
