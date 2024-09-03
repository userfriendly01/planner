import { ActionTypeEnum } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";
import {
  BasePhoneNumber,
  BrandTypeEnum, CallerTypeEnum, CallFlowTypeEnum, ChannelTypeEnum, LanguageOfferTypeEnum, PhoneNumber, PhoneNumberRecordType, PhoneNumberTypeEnum
} from "../../GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  CctSharedCallFlowDb
} from "../../GraphQL/Legacy.PhoneNumber.Interfaces";

const mockBasePhoneNumber: BasePhoneNumber = Object.freeze({
  brand: BrandTypeEnum.LIBERTY_MUTUAL,
  callFlowTemplate: "testCallFlowTemplate",
  callTypeDescription: "testCallTypeDescription",
  channel: ChannelTypeEnum.SALES,
  dialedDescription: "testDialedDescription",
  employeeId: "n1234567",
  internetPlacement: "testInternetPlacement",
  lineOfBusiness: "testLineOfBusiness",
  marketingChannel: "testMarketingChannel",
  predictiveCaller: false,
  rangeIndicator: "testRangeIndicator",
  requestID: "testRequestID",
  tfnRoutingGroup: "testTfnRoutingGroup",
  tollFreeNumber: "testTollFreeNumber",
  transferCode: "testTransferCode",
  whisper: "testWhisper"
});

export const mockDynamicPhoneNumber: PhoneNumber = Object.freeze({
  ...mockBasePhoneNumber,
  callerType: CallerTypeEnum.CUSTOMER,
  callFlowName: "testCallFlowName",
  callFlowType: CallFlowTypeEnum.DTMF,
  callFlowRoute: "testCallFlowRoute",
  callIntent: "testCallIntent",
  createTime: 1,
  dataRequests: ["testDataRequests"],
  greetingMessages: "Thanks for reading through this PR!",
  languageOffer: LanguageOfferTypeEnum.ENGLISH,
  nextActionId: "testNextActionId",
  nextActionType: ActionTypeEnum.TRANSFER,
  officeNumbers: ["testOfficeNumbers"],
  phoneNumber: "+1234567890",
  phoneNumberType: PhoneNumberTypeEnum.TFN,
  transferDestination: "testTransferDestination",
  updateTime: 2,
  migrateSelfServiceNumberToDynamic: false
});

export const mockLegacyPhoneNumber: CctSharedCallFlowDb = Object.freeze({
  ...mockBasePhoneNumber,
  pkey: "+18028675309",
  accountManager: "testAccountManager",
  affinityVDN: "testAffinityVDN",
  agentId: "testAgentId",
  callDetails1: "testCallDetails1",
  callDetails2: "testCallDetails2",
  content: {
    callFlowRoute: "testCallFlowRoute",
    callIntent: "testCallIntent",
    callerType: CallerTypeEnum.CUSTOMER,
    dataRequests: ["testDataRequests"],
    greetingMessages: "testGreetingMessages",
    languageOffer: LanguageOfferTypeEnum.ENGLISH,
    officeNumbers: ["testOfficeNumbers"],
    transferNumber: "testTransferNumber"
  },
  createTime: "2024-08-09T19:45:21.834Z",
  selfServiceIndicator: false,
  type: PhoneNumberTypeEnum.TFN,
  updateTime: "2024-08-09T19:45:21.835Z",
  userDestination: "testUserDestination"
});

export const mockCombinedPhoneNumberRecords: PhoneNumberRecordType[] = [mockDynamicPhoneNumber, mockLegacyPhoneNumber];
