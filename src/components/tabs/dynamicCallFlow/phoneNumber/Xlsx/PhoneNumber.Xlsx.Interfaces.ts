import { XlsxJSONRow } from "../../common/Xlsx/Xlsx.Interfaces";


export interface PhoneNumberXlsxRow extends XlsxJSONRow {
  dialedPhoneNumber: string;
  brand: string;
  callFlowName: string;
  callFlowTemplate: string;
  callFlowType: string;
  callTypeDescription: string;
  channel: string;
  callFlowRoute: string;
  callIntent: string;
  callerType: string;
  dataRequests: string;
  dialedDescription: string;
  greetingMessages: string;
  internetPlacement: string;
  languageOffer: string;
  lineOfBusiness: string;
  marketingChannel: string;
  officeNumbers: string;
  phoneNumberType: string;
  predictiveCaller: string;
  rangeIndicator: string;
  requestID: string;
  tfnRoutingGroup: string;
  tollFreeNumber: string;
  transferCode: string;
  whisper: string;
  nextActionId: string;
  nextActionType: string;
  transferDestination: string;
  accountManager: string;
  affinityVDN: string;
  agentId: string;
  callDetails1: string;
  callDetails2: string;
  selfServiceIndicator: string;
  userDestination: string;
}