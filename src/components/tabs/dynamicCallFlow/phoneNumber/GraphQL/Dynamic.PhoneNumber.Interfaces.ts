import { CctSharedCallFlowDb } from "./Legacy.PhoneNumber.Interfaces";

import {
  ActionType
} from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";

//This is interface name matches what is defined in GraphQL schema
export interface CallFlowDeleteInput {
    id: string;
    actionType?: ActionType
}

export type PhoneNumberRecordType = CctSharedCallFlowDb | PhoneNumber;

export type BrandType = "Safeco" | "Liberty Mutual" | "Comparion";
export enum BrandTypeEnum {
    SAFECO = "Safeco",
    LIBERTY_MUTUAL = "Liberty Mutual",
    COMPARION = "Comparion"
}

export interface BrandNameMap{
    [key:string]: "liberty" | "safeco"
}

export const BrandName: BrandNameMap = {
  "Liberty Mutual": "liberty",
  "Safeco": "safeco"
};

export type CallFlowNameType = "LSC" | "AISG Main";
export enum CallFlowNameEnum {
    LSC = "LSC",
    AISG_MAIN = "AISG Main"
}

export type CallFlowType ="DTMF" | "Self Service";
export enum CallFlowTypeEnum {
    DTMF = "DTMF",
    SELFSERVICE = "Self Service",
}

export type CallerType = "Customer";
export enum CallerTypeEnum {
    CUSTOMER = "Customer"
}

export type ChannelType = "Sales" | "Service" | "Claims";
export enum ChannelEnum {
    SALES = "Sales",
    SERVICE = "Service",
    CLAIMS = "Claims",
}

export type LanguageOfferType = "English" | "Spanish";
export enum LanguageOfferEnum {
    ENGLISH = "English",
    SPANISH = "Spanish",
}

export type PhoneNumberType = "" | "DID" | "TFN";
export enum PhoneNumberTypeEnum {
    BLANK = "",
    DID = "DID",
    TFN = "TFN"
}

export type TfnRoutingGroupType = TfnRoutingGroupEnum.PREMIER_PARTNERS | TfnRoutingGroupEnum.TRU_STAGE | TfnRoutingGroupEnum.TRU_STAGE_NAVY |
  TfnRoutingGroupEnum.USAA | TfnRoutingGroupEnum.HIGH_TOUCH_PRODUCTS | TfnRoutingGroupEnum.ONLINE_INBOUND | TfnRoutingGroupEnum.CORE |
  TfnRoutingGroupEnum.LSC_AGENT_SALES | TfnRoutingGroupEnum.LSC_BOOK_TRANSFER | TfnRoutingGroupEnum.LSC_DIRECT_SALES | TfnRoutingGroupEnum.LSC_HOME_INS_DOT_COM |
  TfnRoutingGroupEnum.LSC_PRIORITY_AGENT | TfnRoutingGroupEnum.LSC_PRIORITY_CAMPAIGNS | TfnRoutingGroupEnum.LSC_USAA;

export enum TfnRoutingGroupEnum {
    PREMIER_PARTNERS = "Premier Partners",
    TRU_STAGE = "TruStage",
    TRU_STAGE_NAVY = "TruStageNavy",
    USAA = "USAA",
    HIGH_TOUCH_PRODUCTS = "High Touch Products",
    ONLINE_INBOUND = "Online Inbound",
    CORE = "Core",
    LSC_AGENT_SALES = "LSCAgentSales",
    LSC_BOOK_TRANSFER = "LSCBookTransfer",
    LSC_DIRECT_SALES = "LSCDirectSales",
    LSC_HOME_INS_DOT_COM = "LSCHomeInsDotCom",
    LSC_PRIORITY_AGENT = "LSCPriorityAgent",
    LSC_PRIORITY_CAMPAIGNS = "LSCPriorityCampaigns",
    LSC_USAA = "LSCUSAA"
}

export type UserDestinationType = UserDestinationEnum.AVAYA | UserDestinationEnum.TWILIO;
export enum UserDestinationEnum {
    AVAYA = "Avaya",
    TWILIO = "Twilio"
}

export interface BasePhoneNumber {
    brand: BrandType;
    callFlowTemplate: string;
    callTypeDescription: string;
    channel: ChannelType;
    dialedDescription: string;
    employeeId: string;
    internetPlacement: string;
    lineOfBusiness: string;
    marketingChannel: string;
    predictiveCaller: boolean;
    rangeIndicator: string;
    requestID: string;
    tfnRoutingGroup: string;
    tollFreeNumber: string;
    transferCode: string;
    whisper: string;
}

export interface PhoneNumber extends BasePhoneNumber {
    callerType?: CallerType;
    callFlowName?: string,
    callFlowType?: CallFlowType;
    callFlowRoute?: string;
    callIntent?: string;
    createTime?: number;
    dataRequests?: Array<string>;
    greetingMessages?: string;
    languageOffer?: LanguageOfferType;
    nextActionId?: string;
    nextActionType?: ActionType;
    officeNumbers?: Array<string>;
    phoneNumber?: string;
    phoneNumberType?: PhoneNumberType;
    transferDestination?: string;
    updateTime?: number;
}


