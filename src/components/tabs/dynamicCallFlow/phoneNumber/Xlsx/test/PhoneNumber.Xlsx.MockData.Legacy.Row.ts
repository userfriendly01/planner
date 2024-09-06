import {
  BrandTypeEnum,
  CallerTypeEnum,
  ChannelTypeEnum,
  LanguageOfferTypeEnum, PhoneNumberTypeEnum
} from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  LegacyPhoneNumberXlsxRow
} from "dynamicCallFlowPhoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";

export const testLegacyPhoneNumberXlsxRow: LegacyPhoneNumberXlsxRow = {
  dialedPhoneNumber: "+12345678910",
  accountManager: "testLegacyAccountManager",
  affinityVDN: "testLegacyAffinityVDN",
  agentId: "n0123456",
  brand: BrandTypeEnum.LIBERTY_MUTUAL,
  employeeId: "n0123456",
  callDetails1: "testLegacyCallDetails1",
  callDetails2: "testLegacyCallDetails2",
  callFlowTemplate: "testLegacyCallFlowTemplate",
  callFlowType: "",
  callTypeDescription: "testLegacyCallTypeDescription",
  channel: ChannelTypeEnum.SERVICE,
  callFlowRoute: "testLegacyCallFlowRoute",
  callIntent: "testLegacyCallIntent",
  callerType: CallerTypeEnum.CUSTOMER,
  dataRequests: "testLegacyDataRequests",
  greetingMessages: "testLegacyGreetingMessages",
  languageOffer: LanguageOfferTypeEnum.ENGLISH,
  officeNumbers: "officeNumbers",
  transferDestination: "testLegacyTransferDestination",
  dialedDescription: "testLegacyDialedDescription",
  internetPlacement: "testLegacyInternetPlacement",
  lineOfBusiness: "testLegacyLineOfBusiness",
  marketingChannel: "testLegacyMarketingChannel",
  phoneNumberType: PhoneNumberTypeEnum.TFN,
  predictiveCaller: "false",
  rangeIndicator: "testLegacyRangeIndicator",
  requestID: "requestID",
  selfServiceIndicator: "true",
  tfnRoutingGroup: "testLegacyTfnRoutingGroup",
  tollFreeNumber: "testLegacyTollFreeNumber",
  transferCode: "testLegacyTransferCode",
  userDestination: "testLegacyUserDestination",
  whisper: "testLegacyWhisper"
};
