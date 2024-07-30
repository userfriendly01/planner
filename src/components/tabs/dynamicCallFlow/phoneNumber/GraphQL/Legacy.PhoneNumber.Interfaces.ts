import {
  BasePhoneNumber,
  CallerType,
  LanguageOfferType
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";

export interface CctSharedCallFlowDbDelInput {
    pkey: string;
}

export interface CctSharedCallFlowDbBatchDelInput {
    pkey: Array<string>;
}

export type LegacyPhoneNumberType = "" | "DID" | "DRC" | "LSC" | "TFN";

export enum LegacyPhoneNumberTypeEnum {
    BLANK = "",
    DID = "DID",
    DRC = "DRC",
    LSC = "LSC",
    TFN = "TFN"
}

export interface FlowContent {
    callFlowRoute?: string;
    callIntent?: string;
    callerType?: CallerType;
    dataRequests?: Array<string>;
    greetingMessages?: string;
    languageOffer?: LanguageOfferType;
    officeNumbers?: Array<string>;
    transferNumber?: string;
}

export interface CctSharedCallFlowDb extends BasePhoneNumber {
    pkey?: string;
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

