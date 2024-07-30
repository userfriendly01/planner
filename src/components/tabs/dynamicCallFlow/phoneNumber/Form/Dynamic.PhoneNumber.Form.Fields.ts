import {
  RECORD_DATA_TYPE_NAME, RECORD_DATA_TYPE_NAME_ENUM
} from "components/tabs/dynamicCallFlow/common/Xlsx/Abstract.Xlsx.Importer";
import { CALLER_CONTEXT_ATTRIBUTES } from "components/tabs/dynamicCallFlow/action/Form/ActionFields";

export const BRAND = "brand";
export const CALL_FLOW_TEMPLATE = "callFlowTemplate";
export const CALL_FLOW_ROUTE = "callFlowRoute";
export const CALL_INTENT = "callIntent";
export const CALL_TYPE_DESCRIPTION = "callTypeDescription";
export const CALLER_TYPE = "callerType";
export const CHANNEL = "channel";
export const CREATE_TIME = "createTime";
export const DATA_REQUESTS = "dataRequests";
export const DIALED_DESCRIPTION = "dialedDescription";
export const EMPLOYEE_ID = "employeeId";
export const GREETING_MESSAGES = "greetingMessages";
export const INTERNET_PLACEMENT = "internetPlacement";
export const LANGUAGE_OFFER = "languageOffer";
export const LINE_OF_BUSINESS = "lineOfBusiness";
export const MARKETING_CHANNEL = "marketingChannel";
export const OFFICE_NUMBERS = "officeNumbers";
export const PREDICTIVE_CALLER = "predictiveCaller";
export const RANGE_INDICATOR = "rangeIndicator";
export const REQUEST_ID = "requestID";
export const TFN_ROUTING_GROUP = "tfnRoutingGroup";
export const TOLL_FREE_NUMBER = "tollFreeNumber";
export const TRANSFER_CODE = "transferCode";
export const UPDATE_TIME = "updateTime";
export const WHISPER = "whisper";
export const CALL_FLOW_NAME = "callFlowName";
export const CALL_FLOW_TYPE = "callFlowType";
export const NEXT_ACTION_ID = "nextActionId";
export const NEXT_ACTION_TYPE = "nextActionType";
export const PHONE_NUMBER = "phoneNumber";
export const PHONE_NUMBER_TYPE = "phoneNumberType";
export const TRANSFER_DESTINATION = "transferDestination";

export const CommonPhoneNumberFormFields: Array<string> = [
  BRAND,
  CALL_FLOW_TEMPLATE,
  CALL_FLOW_ROUTE,
  CALL_INTENT,
  CALL_TYPE_DESCRIPTION,
  CALLER_TYPE,
  CHANNEL,
  CREATE_TIME,
  DATA_REQUESTS,
  DIALED_DESCRIPTION,
  EMPLOYEE_ID,
  GREETING_MESSAGES,
  INTERNET_PLACEMENT,
  LANGUAGE_OFFER,
  LINE_OF_BUSINESS,
  MARKETING_CHANNEL,
  OFFICE_NUMBERS,
  PREDICTIVE_CALLER,
  RANGE_INDICATOR,
  REQUEST_ID,
  TFN_ROUTING_GROUP,
  TOLL_FREE_NUMBER,
  TRANSFER_CODE,
  UPDATE_TIME,
  WHISPER
];
Object.freeze(CommonPhoneNumberFormFields);

export const UniqueDynamicPhoneNumberFormFields: Array<string> = [
  CALL_FLOW_NAME,
  CALL_FLOW_TYPE,
  NEXT_ACTION_ID,
  NEXT_ACTION_TYPE,
  PHONE_NUMBER,
  PHONE_NUMBER_TYPE
];
Object.freeze(UniqueDynamicPhoneNumberFormFields);

export const DynamicPhoneNumberFormFields: Array<string> = UniqueDynamicPhoneNumberFormFields.concat(CommonPhoneNumberFormFields);
Object.freeze(DynamicPhoneNumberFormFields);

export const DynamicPhoneNumberFieldToDataTypeMap: Map<string, RECORD_DATA_TYPE_NAME> = new Map([
  [ PREDICTIVE_CALLER, RECORD_DATA_TYPE_NAME_ENUM.BOOLEAN ],
  [ CREATE_TIME, RECORD_DATA_TYPE_NAME_ENUM.NUMBER ],
  [ UPDATE_TIME, RECORD_DATA_TYPE_NAME_ENUM.NUMBER ],
  [ DATA_REQUESTS, RECORD_DATA_TYPE_NAME_ENUM.STRING_ARRAY ],
  [ OFFICE_NUMBERS, RECORD_DATA_TYPE_NAME_ENUM.STRING_ARRAY],
  [ CALLER_CONTEXT_ATTRIBUTES, RECORD_DATA_TYPE_NAME_ENUM.JSON_STRINGIFY]
]);
Object.freeze(DynamicPhoneNumberFieldToDataTypeMap);