export interface DynamicCallFlowPhoneNumberMasterData {
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

export interface DynamicCallFlowPhoneNumberDropDownList {
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