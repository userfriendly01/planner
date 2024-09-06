import {
  BrandTypeEnum, CallFlowTypeEnum,
  CallerTypeEnum,
  ChannelTypeEnum,
  LanguageOfferTypeEnum, PhoneNumberTypeEnum
} from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  DynamicPhoneNumberXlsxRow
} from "dynamicCallFlowPhoneNumber/Xlsx/PhoneNumber.Xlsx.Interfaces";
import { ActionTypeEnum } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";
import { booleanAsString } from "dynamicCallFlowCommon/Util/Boolean.Util";

export const testDynamicPhoneNumberXlsxRow: DynamicPhoneNumberXlsxRow = {
  dialedPhoneNumber: "+12345678910",
  brand: BrandTypeEnum.LIBERTY_MUTUAL,
  employeeId: "n0123456",
  callFlowName: "mockDynamicCallFlow",
  callFlowTemplate: "mockDynamicCallFlow",
  callFlowType: CallFlowTypeEnum.DTMF,
  callTypeDescription: "testDynamicCallTypeDescription",
  channel: ChannelTypeEnum.SERVICE,
  callFlowRoute: "testDynamicCallFlowRoute",
  callIntent: "testDynamicCallIntent",
  callerType: CallerTypeEnum.CUSTOMER,
  dataRequests: "testDynamicDataRequests",
  greetingMessages: "testDynamicGreetingMessages",
  languageOffer: LanguageOfferTypeEnum.ENGLISH,
  officeNumbers: "officeNumbers",
  transferDestination: "testDynamicTransferDestination",
  dialedDescription: "testDynamicDialedDescription",
  internetPlacement: "testDynamicInternetPlacement",
  lineOfBusiness: "testDynamicLineOfBusiness",
  marketingChannel: "testDynamicMarketingChannel",
  nextActionId: "b8095018-a089-4d6f-af5b-672e19a1f36b",
  nextActionType: ActionTypeEnum.ANNOUNCEMENT,
  phoneNumberType: PhoneNumberTypeEnum.TFN,
  predictiveCaller: "false",
  rangeIndicator: "testDynamicRangeIndicator",
  requestID: "requestID",
  tfnRoutingGroup: "testDynamicTfnRoutingGroup",
  tollFreeNumber: "testDynamicTollFreeNumber",
  transferCode: "testDynamicTransferCode",
  whisper: "testDynamicWhisper",
  migrateSelfServiceNumberToDynamic: ""
};

export const testMigratingDynamicPhoneNumberXlsxRow: DynamicPhoneNumberXlsxRow = {
  ...testDynamicPhoneNumberXlsxRow,
  callFlowType: CallFlowTypeEnum.SELFSERVICE,
  migrateSelfServiceNumberToDynamic: booleanAsString(true),
  nextActionId: "will be deleted",
  nextActionType: ActionTypeEnum.ANNOUNCEMENT
};

export const testSelfServiceDynamicPhoneNumberXlsxRow: DynamicPhoneNumberXlsxRow = {
  ...testDynamicPhoneNumberXlsxRow,
  callFlowType: CallFlowTypeEnum.SELFSERVICE,
  callFlowTemplate: CallFlowTypeEnum.SELFSERVICE,
  callFlowName: CallFlowTypeEnum.SELFSERVICE,
  migrateSelfServiceNumberToDynamic: "",
  nextActionId: "",
  nextActionType: ""
};
