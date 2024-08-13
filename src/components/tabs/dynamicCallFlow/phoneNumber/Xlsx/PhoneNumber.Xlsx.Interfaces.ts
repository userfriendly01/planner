import {
  ACCOUNT_MANAGER,
  AFFINITY_VDN,
  AGENT_ID, CALL_DETAILS_1, CALL_DETAILS_2, USER_DESTINATION
} from "dynamicCallFlowPhoneNumber/Form/Legacy.PhoneNumber.Form.Fields";
import {
  BRAND, CALL_FLOW_NAME,
  CALL_FLOW_ROUTE,
  CALL_FLOW_TEMPLATE, CALL_FLOW_TYPE,
  CALL_INTENT,
  CALL_TYPE_DESCRIPTION,
  CALLER_TYPE,
  CHANNEL,
  DATA_REQUESTS,
  DIALED_DESCRIPTION,
  EMPLOYEE_ID,
  GREETING_MESSAGES,
  INTERNET_PLACEMENT,
  LANGUAGE_OFFER,
  LINE_OF_BUSINESS,
  MARKETING_CHANNEL, MIGRATE_SELF_SERVICE_NUMBER_TO_DYNAMIC, NEXT_ACTION_ID, NEXT_ACTION_TYPE,
  OFFICE_NUMBERS,
  PHONE_NUMBER_TYPE,
  PREDICTIVE_CALLER,
  RANGE_INDICATOR,
  REQUEST_ID,
  TFN_ROUTING_GROUP,
  TOLL_FREE_NUMBER,
  TRANSFER_CODE, TRANSFER_DESTINATION, WHISPER
} from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";

export type PhoneNumberXlsxRow = DynamicPhoneNumberXlsxRow | LegacyPhoneNumberXlsxRow;

export const DIALED_PHONE_NUMBER = "dialedPhoneNumber";

export interface BasePhoneNumberXlsxRow {
  brand: string;
  callFlowTemplate: string;
  callFlowType: string;
  callTypeDescription: string;
  channel: string;
  callFlowRoute: string;
  callIntent: string;
  callerType: string;
  dataRequests: string;
  dialedPhoneNumber: string;
  greetingMessages: string;
  languageOffer: string;
  officeNumbers: string;
  employeeId: string;
  dialedDescription: string;
  internetPlacement: string;
  lineOfBusiness: string;
  marketingChannel: string;
  phoneNumberType: string;
  predictiveCaller: string;
  rangeIndicator: string;
  requestID: string;
  transferDestination: string;
  tfnRoutingGroup: string;
  tollFreeNumber: string;
  transferCode: string;
  whisper: string;
}

export interface DynamicPhoneNumberXlsxRow extends BasePhoneNumberXlsxRow {
  callFlowName: string;
  nextActionId?: string;
  nextActionType?: string;
  // This field will be removed once all self service numbers are migrated to dynamic call flow:
  migrateSelfServiceNumberToDynamic?: string;
}

export interface LegacyPhoneNumberXlsxRow extends BasePhoneNumberXlsxRow {
  accountManager: string;
  affinityVDN: string;
  agentId: string;
  callDetails1: string;
  callDetails2: string;
  selfServiceIndicator: string;
  userDestination: string;
}

export const DynamicPhoneNumberXlsxHeaders: Array<string> = [
  DIALED_PHONE_NUMBER,
  BRAND,
  EMPLOYEE_ID,
  CALL_FLOW_NAME,
  CALL_FLOW_TEMPLATE,
  CALL_FLOW_TYPE,
  CALL_TYPE_DESCRIPTION,
  CHANNEL,
  CALL_FLOW_ROUTE,
  CALL_INTENT,
  CALLER_TYPE,
  DATA_REQUESTS,
  GREETING_MESSAGES,
  LANGUAGE_OFFER,
  OFFICE_NUMBERS,
  TRANSFER_DESTINATION,
  DIALED_DESCRIPTION,
  INTERNET_PLACEMENT,
  LINE_OF_BUSINESS,
  MARKETING_CHANNEL,
  MIGRATE_SELF_SERVICE_NUMBER_TO_DYNAMIC,
  NEXT_ACTION_ID,
  NEXT_ACTION_TYPE,
  PHONE_NUMBER_TYPE,
  PREDICTIVE_CALLER,
  RANGE_INDICATOR,
  REQUEST_ID,
  TFN_ROUTING_GROUP,
  TOLL_FREE_NUMBER,
  TRANSFER_CODE,
  WHISPER
];

export const LegacyPhoneNumberXlsxHeaders: Array<string> = [
  DIALED_PHONE_NUMBER,
  ACCOUNT_MANAGER,
  AFFINITY_VDN,
  AGENT_ID,
  BRAND,
  EMPLOYEE_ID,
  CALL_DETAILS_1,
  CALL_DETAILS_2,
  CALL_FLOW_TEMPLATE,
  CALL_TYPE_DESCRIPTION,
  CHANNEL,
  CALL_FLOW_ROUTE,
  CALL_INTENT,
  CALLER_TYPE,
  DATA_REQUESTS,
  GREETING_MESSAGES,
  LANGUAGE_OFFER,
  OFFICE_NUMBERS,
  DIALED_DESCRIPTION,
  INTERNET_PLACEMENT,
  LINE_OF_BUSINESS,
  MARKETING_CHANNEL,
  PHONE_NUMBER_TYPE,
  PREDICTIVE_CALLER,
  RANGE_INDICATOR,
  TFN_ROUTING_GROUP,
  TOLL_FREE_NUMBER,
  TRANSFER_CODE,
  TRANSFER_DESTINATION,
  USER_DESTINATION,
  WHISPER
];
Object.freeze(LegacyPhoneNumberXlsxHeaders);