import {
  CALL_FLOW_ROUTE,
  CALL_INTENT,
  CALLER_TYPE,
  CommonPhoneNumberFields,
  DATA_REQUESTS,
  GREETING_MESSAGES,
  LANGUAGE_OFFER,
  OFFICE_NUMBERS,
  PREDICTIVE_CALLER
} from "./DynamicPhoneNumberFields";
import { DIALED_PHONENUMBER } from "../XlsxReader/XlsxHeaders";
import {
  RECORD_DATA_TYPE_NAME, RECORD_DATA_TYPE_NAME_ENUM
} from "../../../../common/XlsxReader/AbstractXlsxReader";

export const ACCOUNT_MANAGER = "accountManager";
export const AFFINITY_VDN = "affinityVDN";
export const AGENT_ID = "agentId";
export const CALL_DETAILS_1 = "callDetails1";
export const CALL_DETAILS_2 = "callDetails2";
export const PKEY = "pkey";
export const SELF_SERVICE_INDICATOR = "selfServiceIndicator";
export const TRANSFER_NUMBER = "transferNumber";
export const TYPE = "type";
export const USER_DESTINATION = "userDestination";

export const UniqueLegacyPhoneNumberFields: Array<string> = [
  ACCOUNT_MANAGER,
  AFFINITY_VDN,
  AGENT_ID,
  CALL_DETAILS_1,
  CALL_DETAILS_2,
  PKEY,
  SELF_SERVICE_INDICATOR,
  TRANSFER_NUMBER,
  TYPE,
  USER_DESTINATION
];
Object.freeze(UniqueLegacyPhoneNumberFields);

export const LegacyPhoneNumberContentFields: Array<string> = [
  CALL_FLOW_ROUTE,
  CALL_INTENT,
  CALLER_TYPE,
  DATA_REQUESTS,
  GREETING_MESSAGES,
  LANGUAGE_OFFER,
  OFFICE_NUMBERS
];
Object.freeze(LegacyPhoneNumberContentFields);

export const LegacyPhoneNumberFields: Array<string> = UniqueLegacyPhoneNumberFields.concat(CommonPhoneNumberFields, LegacyPhoneNumberContentFields);
Object.freeze(LegacyPhoneNumberFields);

export function isLegacyContentField(key: string): boolean {
  return LegacyPhoneNumberContentFields.includes(key);
}