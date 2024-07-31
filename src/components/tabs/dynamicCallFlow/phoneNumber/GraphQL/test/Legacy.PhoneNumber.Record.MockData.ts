import {
  CallerTypeEnum,
  LanguageOfferTypeEnum
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { BasePhoneNumberRecordMock } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/test/Dynamic.PhoneNumber.MockData";
import {
  CctSharedCallFlowDb,
  LegacyPhoneNumberTypeEnum
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";

const LegacyPhoneNumberRecordMock: CctSharedCallFlowDb = {
  ...BasePhoneNumberRecordMock,
  pkey: "8882220001",
  accountManager: "n0000005",
  affinityVDN: "affinityVDN",
  agentId: "n0000006",
  callDetails1: "call details 1",
  callDetails2: "call details 2",
  content: {
    callIntent: "call intent",
    callerType: CallerTypeEnum.CUSTOMER,
    callFlowRoute: "call flow route",
    dataRequests: ["data request"],
    greetingMessages: "Hello",
    languageOffer: LanguageOfferTypeEnum.ENGLISH,
    transferNumber: "transfer number",
    officeNumbers: ["office number"]
  },
  createTime: "2024-04-10T13:33:53.000Z",
  selfServiceIndicator: false,
  type: LegacyPhoneNumberTypeEnum.TFN,
  updateTime: "2024-04-10T13:33:53.000Z",
  userDestination: "user destination"
};


export const LegacyPhoneNumberOne: CctSharedCallFlowDb = mockLegacyPhoneNumber("8004440001");
export const LegacyPhoneNumberTwo: CctSharedCallFlowDb = mockLegacyPhoneNumber("8004440002");
export const LegacyPhoneNumberThree: CctSharedCallFlowDb = mockLegacyPhoneNumber("8004440003");
export const LegacyPhoneNumberFour: CctSharedCallFlowDb = mockLegacyPhoneNumber("8004440004");
export const LegacyPhoneNumberArray: Array<CctSharedCallFlowDb> = [
  LegacyPhoneNumberOne,
  LegacyPhoneNumberTwo,
  LegacyPhoneNumberThree,
  LegacyPhoneNumberFour
];

export function mockLegacyPhoneNumber(pkey: string): CctSharedCallFlowDb {
  return mockLegacyPhoneNumberObject({ pkey });
}

export function mockLegacyPhoneNumberObject(cctSharedCallFlowDb: CctSharedCallFlowDb): CctSharedCallFlowDb {
  return {
    ...LegacyPhoneNumberRecordMock,
    ...cctSharedCallFlowDb
  } as CctSharedCallFlowDb;
}