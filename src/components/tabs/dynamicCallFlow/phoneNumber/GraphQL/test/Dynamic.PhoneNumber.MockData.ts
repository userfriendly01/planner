import {
  BasePhoneNumber,
  BrandTypeEnum,
  CallerTypeEnum,
  CallFlowNameTypeEnum,
  CallFlowTypeEnum,
  ChannelTypeEnum,
  LanguageOfferTypeEnum,
  PhoneNumber,
  PhoneNumberTypeEnum
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { ActionTypeEnum } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";

export const BasePhoneNumberRecordMock: BasePhoneNumber = {
  brand: BrandTypeEnum.SAFECO,
  callFlowTemplate: CallFlowNameTypeEnum.LSC,
  callTypeDescription: "LSC",
  channel: ChannelTypeEnum.CLAIMS,
  dialedDescription: "testing phone number record",
  employeeId: "n0000000",
  internetPlacement: "internet placement",
  lineOfBusiness: "line of business",
  marketingChannel: "marketing channel",
  predictiveCaller: false,
  rangeIndicator: "range indicator",
  requestID: "request id",
  tfnRoutingGroup: "tfn routing group",
  tollFreeNumber: "8005551212",
  transferCode: "005",
  whisper: "whisper"
};

const DynamicPhoneNumberRecordMock: PhoneNumber = {
  ...BasePhoneNumberRecordMock,
  callerType: CallerTypeEnum.CUSTOMER,
  callFlowName: CallFlowNameTypeEnum.LSC,
  callFlowType: CallFlowTypeEnum.DTMF,
  callFlowRoute: "call flow route",
  callIntent: "call intent",
  createTime: 1712756033000,
  dataRequests: ["data request"],
  greetingMessages: "Hello",
  languageOffer: LanguageOfferTypeEnum.ENGLISH,
  nextActionId: "nextActionIdTwo",
  nextActionType: ActionTypeEnum.ANNOUNCEMENT,
  officeNumbers: ["office number"],
  phoneNumber: "+18005551212",
  phoneNumberType: PhoneNumberTypeEnum.TFN,
  transferDestination: "transfer destination",
  updateTime: 1712756033000
};

export const DynamicPhoneNumberOne: PhoneNumber = mockDynamicPhoneNumber("+18005550001");
Object.freeze(DynamicPhoneNumberOne);
export const DynamicPhoneNumberTwo: PhoneNumber = mockDynamicPhoneNumber("+18005550002");
Object.freeze(DynamicPhoneNumberTwo);
export const DynamicPhoneNumberThree: PhoneNumber = mockDynamicPhoneNumber("+18005550003");
Object.freeze(DynamicPhoneNumberThree);
export const DynamicPhoneNumberFour: PhoneNumber = mockDynamicPhoneNumber("+18005550004");
Object.freeze(DynamicPhoneNumberFour);
export const DynamicPhoneNumberArray: Array<PhoneNumber> = [
  DynamicPhoneNumberOne,
  DynamicPhoneNumberTwo,
  DynamicPhoneNumberThree,
  DynamicPhoneNumberFour
];
Object.freeze(DynamicPhoneNumberArray);

export function mockDynamicPhoneNumber(phoneNumber: string): PhoneNumber {
  return mockDynamicPhoneNumberObject({ phoneNumber });
}

export function mockDynamicPhoneNumberObject(phoneNumber: PhoneNumber): PhoneNumber {
  return {
    ...DynamicPhoneNumberRecordMock,
    ...phoneNumber
  } as PhoneNumber;
}

export function mockDynamicPhoneNumberArray(): Array<PhoneNumber> {
  return [ {
    ...DynamicPhoneNumberOne
  }, {
    ...DynamicPhoneNumberTwo
  }, {
    ...DynamicPhoneNumberThree
  }, {
    ...DynamicPhoneNumberFour
  }];
}
