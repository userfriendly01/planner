import {
  BRAND,
  CALL_FLOW_ROUTE,
  CALL_FLOW_TEMPLATE,
  CALL_INTENT,
  CALL_TYPE_DESCRIPTION,
  CALLER_TYPE,
  CHANNEL,
  DATA_REQUESTS,
  DIALED_DESCRIPTION,
  PHONE_NUMBER_LABEL,
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
  TRANSFER_CODE,
  WHISPER,
  DIALED_DESCRIPTION_LABEL,
  CALL_FLOW_TEMPLATE_LABEL,
  CHANNEL_LABEL,
  BRAND_LABEL,
  LANGUAGE_OFFER_LABEL,
  DATA_REQUESTS_LABEL,
  CALLER_TYPE_LABEL,
  PHONE_NUMBER_TYPE_LABEL,
  CALL_FLOW_ROUTE_LABEL,
  GREETING_MESSAGES_LABEL,
  EMPLOYEE_ID_LABEL,
  CALL_TYPE_DESCRIPTION_LABEL,
  TRANSFER_CODE_LABEL,
  INTERNET_PLACEMENT_LABEL,
  LINE_OF_BUSINESS_LABEL,
  MARKETING_CHANNEL_LABEL,
  WHISPER_LABEL,
  REQUEST_ID_LABEL,
  RANGE_INDICATOR_LABEL,
  CALL_INTENT_LABEL,
  OFFICE_NUMBERS_LABEL, TFN_ROUTING_GROUP_LABEL, PREDICTIVE_CALLER_LABEL
} from "components/tabs/dynamicCallFlow/phoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import {
  ACCOUNT_MANAGER, ACCOUNT_MANAGER_LABEL,
  AFFINITY_VDN, AFFINITY_VDN_LABEL, AGENT_ID, AGENT_ID_LABEL,
  CALL_DETAILS_1, CALL_DETAILS_1_LABEL,
  CALL_DETAILS_2, CALL_DETAILS_2_LABEL,
  PKEY,
  SELF_SERVICE_INDICATOR, SELF_SERVICE_INDICATOR_LABEL,
  TRANSFER_NUMBER, TRANSFER_NUMBER_LABEL,
  TYPE, USER_DESTINATION, USER_DESTINATION_LABEL
} from "components/tabs/dynamicCallFlow/phoneNumber/Form/Legacy.PhoneNumber.Form.Fields";
import {
  ControlEnum, FIELD_IS_DISABLED, FIELD_IS_NOT_DISABLED, FIELD_IS_NOT_REQUIRED, FIELD_IS_REQUIRED,
  FieldConditionCheckType,
  FieldConfigs,
  FieldDataTypeEnum,
  USER_IS_ABLE_TO_CHANGE_CONTROL
} from "components/tabs/dynamicCallFlow/common/Form/Form.Interfaces";

import { Control } from "globals/interfaces";
import { defaultFieldConditionCheck } from "dynamicCallFlowAction/Form/ActionFieldsConfig";
import {
  createFieldConfig,
  didFieldConditionCheck,
  drcFieldConditionCheck
} from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.FieldConfigs";

export const LegacyPhoneNumberFormFieldConfigs: FieldConfigs = {};
export const RequiredPhoneNumberFormFields: Array<string> = [];

/**
 *
 * @param {string} label
 * @param {string} fieldKey
 * @param {Control} control
 * @param {boolean} required
 * @param {boolean} disableEdit
 * @param {FieldDataTypeEnum} dataType
 * @param {FieldConditionCheckType} fieldConditionCheck
 * @param {boolean} isUserAbleToChangeControl
 * @param {number} gridSize
 *
 */
function createLegacyFieldConfig(label: string, fieldKey: string, control: Control, required = false, disableEdit = false, dataType = FieldDataTypeEnum.STRING, fieldConditionCheck?: FieldConditionCheckType, isUserAbleToChangeControl = false, gridSize?: number): void {
  createFieldConfig(label, fieldKey, control, required, disableEdit, dataType, fieldConditionCheck, isUserAbleToChangeControl, gridSize, RequiredPhoneNumberFormFields, LegacyPhoneNumberFormFieldConfigs);
}

createLegacyFieldConfig(PHONE_NUMBER_LABEL, PKEY, ControlEnum.Input, FIELD_IS_REQUIRED, FIELD_IS_DISABLED);
createLegacyFieldConfig(DIALED_DESCRIPTION_LABEL, DIALED_DESCRIPTION, ControlEnum.Input, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED);
createLegacyFieldConfig(CALL_FLOW_TEMPLATE_LABEL, CALL_FLOW_TEMPLATE, ControlEnum.Input, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED);
createLegacyFieldConfig(CHANNEL_LABEL, CHANNEL, ControlEnum.Select, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING);
createLegacyFieldConfig(BRAND_LABEL, BRAND, ControlEnum.Select, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING);
createLegacyFieldConfig(LANGUAGE_OFFER_LABEL, LANGUAGE_OFFER, ControlEnum.Select, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING);
createLegacyFieldConfig(DATA_REQUESTS_LABEL, DATA_REQUESTS, ControlEnum.AutoComplete, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.ARRAY, defaultFieldConditionCheck, USER_IS_ABLE_TO_CHANGE_CONTROL, 10);
createLegacyFieldConfig(CALLER_TYPE_LABEL, CALLER_TYPE, ControlEnum.AutoComplete, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING, defaultFieldConditionCheck, USER_IS_ABLE_TO_CHANGE_CONTROL, 10);
createLegacyFieldConfig(PHONE_NUMBER_TYPE_LABEL, TYPE, ControlEnum.AutoComplete, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED);
createLegacyFieldConfig(TRANSFER_NUMBER_LABEL, TRANSFER_NUMBER, ControlEnum.Input, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED);
createLegacyFieldConfig(CALL_FLOW_ROUTE_LABEL, CALL_FLOW_ROUTE, ControlEnum.AutoComplete, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING, defaultFieldConditionCheck, USER_IS_ABLE_TO_CHANGE_CONTROL, 10);
createLegacyFieldConfig(GREETING_MESSAGES_LABEL, GREETING_MESSAGES, ControlEnum.Input, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED);
createLegacyFieldConfig(EMPLOYEE_ID_LABEL, EMPLOYEE_ID, ControlEnum.Input);
createLegacyFieldConfig(ACCOUNT_MANAGER_LABEL, ACCOUNT_MANAGER, ControlEnum.Input);
createLegacyFieldConfig(AFFINITY_VDN_LABEL, AFFINITY_VDN, ControlEnum.Input);
createLegacyFieldConfig(CALL_TYPE_DESCRIPTION_LABEL, CALL_TYPE_DESCRIPTION, ControlEnum.Input);
createLegacyFieldConfig(TRANSFER_CODE_LABEL, TRANSFER_CODE, ControlEnum.Input);
createLegacyFieldConfig(INTERNET_PLACEMENT_LABEL, INTERNET_PLACEMENT, ControlEnum.Input);
createLegacyFieldConfig(CALL_DETAILS_1_LABEL, CALL_DETAILS_1, ControlEnum.Input, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createLegacyFieldConfig(CALL_DETAILS_2_LABEL, CALL_DETAILS_2, ControlEnum.Input, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createLegacyFieldConfig(LINE_OF_BUSINESS_LABEL, LINE_OF_BUSINESS, ControlEnum.Input, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createLegacyFieldConfig(MARKETING_CHANNEL_LABEL, MARKETING_CHANNEL, ControlEnum.Input, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createLegacyFieldConfig(WHISPER_LABEL, WHISPER, ControlEnum.Input, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createLegacyFieldConfig(REQUEST_ID_LABEL, REQUEST_ID, ControlEnum.Input, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createLegacyFieldConfig(USER_DESTINATION_LABEL, USER_DESTINATION, ControlEnum.Select, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING, didFieldConditionCheck);
createLegacyFieldConfig(RANGE_INDICATOR_LABEL, RANGE_INDICATOR, ControlEnum.Input, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createLegacyFieldConfig(CALL_INTENT_LABEL, CALL_INTENT, ControlEnum.Input);
createLegacyFieldConfig(OFFICE_NUMBERS_LABEL, OFFICE_NUMBERS, ControlEnum.MultiTextField, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.ARRAY);
createLegacyFieldConfig(TFN_ROUTING_GROUP_LABEL, TFN_ROUTING_GROUP, ControlEnum.Select, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING);
createLegacyFieldConfig(PREDICTIVE_CALLER_LABEL, PREDICTIVE_CALLER, ControlEnum.Switch, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.BOOLEAN, drcFieldConditionCheck);
createLegacyFieldConfig(SELF_SERVICE_INDICATOR_LABEL, SELF_SERVICE_INDICATOR, ControlEnum.Switch, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.BOOLEAN, drcFieldConditionCheck);
createLegacyFieldConfig(AGENT_ID_LABEL, AGENT_ID, ControlEnum.Input, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING);

Object.freeze(LegacyPhoneNumberFormFieldConfigs);

