import {
  BasePhoneNumber, CallerType, LanguageOfferType
} from "./Dynamic.PhoneNumber.Interfaces";

export type LegacyPhoneNumberType = "" | "DID" | "DRC" | "LSC" | "TFN";

export enum LegacyPhoneNumberTypeEnum {
    BLANK = "",
    DID = "DID",
    DRC = "DRC",
    LSC = "LSC",
    TFN = "TFN"
}

export interface FlowContent {
    callIntent?: string;
    callerType?: CallerType;
    callFlowRoute?: string;
    dataRequests?: Array<string>;
    greetingMessages?: string;
    languageOffer?: LanguageOfferType;
    transferNumber?: string;
    officeNumbers?: Array<string>;
}

export interface CctSharedCallFlowDb extends BasePhoneNumber {
    accountManager?: string;
    affinityVDN?: string;
    agentId?: string;
    callDetails1?: string;
    callDetails2?: string;
    content?: FlowContent;
    createTime?: string;
    selfServiceIndicator?: boolean,
    type?: LegacyPhoneNumberType;
    updateTime?: string;
    userDestination?: string;
}

