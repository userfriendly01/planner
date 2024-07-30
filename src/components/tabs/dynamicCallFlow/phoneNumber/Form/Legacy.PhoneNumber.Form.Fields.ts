import {
  CALL_FLOW_ROUTE,
  CALL_INTENT,
  CALLER_TYPE,
  CommonPhoneNumberFormFields,
  DATA_REQUESTS,
  GREETING_MESSAGES,
  LANGUAGE_OFFER,
  OFFICE_NUMBERS
} from "components/tabs/dynamicCallFlow/phoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import { CallerType, LanguageOfferType } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { languageOffer } from "utils/alohaFlowUtils";

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

export const UniqueLegacyPhoneNumberFormFields: Array<string> = [
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
Object.freeze(UniqueLegacyPhoneNumberFormFields);

export const LegacyPhoneNumberContentFormFields: Array<string> = [
  CALL_FLOW_ROUTE,
  CALL_INTENT,
  CALLER_TYPE,
  DATA_REQUESTS,
  GREETING_MESSAGES,
  LANGUAGE_OFFER,
  OFFICE_NUMBERS,
  TRANSFER_NUMBER
];
Object.freeze(LegacyPhoneNumberContentFormFields);

export const LegacyPhoneNumberFormFields: Array<string> = UniqueLegacyPhoneNumberFormFields.concat(CommonPhoneNumberFormFields, LegacyPhoneNumberContentFormFields);
Object.freeze(LegacyPhoneNumberFormFields);

export function isLegacyContentField(key: string): boolean {
  return LegacyPhoneNumberContentFormFields.includes(key);
}