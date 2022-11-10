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
export interface CctSharedCallFlowDb {
    pkey: String;
    agentId?: String;
    brand?: String;
    callFlowTemplate?: String;
    channel?: String;
    content?: FlowContent;
    createTime?: String;
    dialedDescription: String;
    employeeId?: String;
    userDestination: String;
    DRC: DRCFlow;
}
