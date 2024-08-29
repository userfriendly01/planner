import {
  BrandTypeEnum,
  CallFlowTypeEnum,
  ChannelTypeEnum,
  PhoneNumber,
  PhoneNumberTypeEnum
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  BRAND,
  BRAND_LABEL,
  CALL_FLOW_ROUTE,
  CALL_FLOW_ROUTE_LABEL,
  CALL_FLOW_TEMPLATE,
  CALL_FLOW_TEMPLATE_LABEL,
  CALL_FLOW_TYPE,
  CALL_FLOW_TYPE_LABEL,
  CALL_INTENT,
  CALL_INTENT_LABEL,
  CALL_TYPE_DESCRIPTION,
  CALL_TYPE_DESCRIPTION_LABEL,
  CALLER_TYPE,
  CALLER_TYPE_LABEL,
  CHANNEL,
  CHANNEL_LABEL,
  DATA_REQUESTS,
  DATA_REQUESTS_LABEL,
  DIALED_DESCRIPTION,
  DIALED_DESCRIPTION_LABEL,
  EMPLOYEE_ID,
  EMPLOYEE_ID_LABEL,
  GREETING_MESSAGES,
  GREETING_MESSAGES_LABEL,
  INTERNET_PLACEMENT,
  INTERNET_PLACEMENT_LABEL,
  LANGUAGE_OFFER,
  LANGUAGE_OFFER_LABEL,
  LINE_OF_BUSINESS,
  LINE_OF_BUSINESS_LABEL,
  MARKETING_CHANNEL,
  MARKETING_CHANNEL_LABEL,
  NEXT_ACTION_ID,
  NEXT_ACTION_ID_LABEL,
  NEXT_ACTION_TYPE,
  NEXT_ACTION_TYPE_LABEL,
  OFFICE_NUMBERS,
  OFFICE_NUMBERS_LABEL,
  PHONE_NUMBER,
  PHONE_NUMBER_LABEL,
  PHONE_NUMBER_TYPE,
  PREDICTIVE_CALLER,
  PREDICTIVE_CALLER_LABEL,
  RANGE_INDICATOR,
  RANGE_INDICATOR_LABEL,
  REQUEST_ID,
  REQUEST_ID_LABEL,
  TFN_ROUTING_GROUP,
  TFN_ROUTING_GROUP_LABEL,
  TRANSFER_CODE,
  TRANSFER_CODE_LABEL,
  TRANSFER_DESTINATION,
  TRANSFER_DESTINATION_LABEL,
  WHISPER,
  WHISPER_LABEL
} from "components/tabs/dynamicCallFlow/phoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import {
  ControlEnum,
  FIELD_IS_DISABLED,
  FIELD_IS_NOT_DISABLED,
  FIELD_IS_NOT_REQUIRED,
  FIELD_IS_REQUIRED,
  FieldConditionCheckType,
  FieldConfig,
  FieldConfigs,
  FieldDataTypeEnum,
  USER_IS_ABLE_TO_CHANGE_CONTROL
} from "components/tabs/dynamicCallFlow/common/Form/Form.Interfaces";

import { Control } from "globals/interfaces";
import { PhoneNumberRecordUtil } from "dynamicCallFlowPhoneNumber/GraphQL/PhoneNumber.Record.Util";

export const drcFieldConditionCheck: FieldConditionCheckType = (phoneNumberRecord: PhoneNumber): boolean => {
  return phoneNumberRecord?.brand === BrandTypeEnum.LIBERTY_MUTUAL
    && phoneNumberRecord?.channel === ChannelTypeEnum.SALES
    && PhoneNumberRecordUtil.getPhoneNumberType(phoneNumberRecord) === PhoneNumberTypeEnum.DRC;
};

export const didFieldConditionCheck: FieldConditionCheckType = (phoneNumberRecord: PhoneNumber): boolean => {
  return PhoneNumberRecordUtil.getPhoneNumberType(phoneNumberRecord) === PhoneNumberTypeEnum.DID;
};

export const dtmfFieldConditionCheck: FieldConditionCheckType = (phoneNumberRecord: PhoneNumber): boolean => {
  return phoneNumberRecord?.callFlowType === CallFlowTypeEnum.DTMF;
};

export const defaultFieldConditionCheck: FieldConditionCheckType = (): boolean => {
  return true;
};

export const DynamicPhoneNumberFormFieldConfigs: FieldConfigs = {};
export const RequiredFieldsPhoneNumberForm: Array<string> = [];

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
 * @param requiredFields
 * @param formFieldConfigs
 */
export function createFieldConfig(label: string, fieldKey: string, control: Control, required: boolean, disableEdit: boolean, dataType = FieldDataTypeEnum.STRING, fieldConditionCheck = defaultFieldConditionCheck, isUserAbleToChangeControl = false, gridSize?: number, requiredFields = RequiredFieldsPhoneNumberForm, formFieldConfigs = DynamicPhoneNumberFormFieldConfigs): void {
  if (required) {
    requiredFields.push(fieldKey);
  }

  formFieldConfigs[fieldKey] = {
    label,
    fieldKey,
    originalControl: control,
    currentControl: control,
    isUserAbleToChangeControl: isUserAbleToChangeControl,
    required,
    disableEdit,
    dataType,
    fieldConditionCheck: fieldConditionCheck,
    gridSize
  } as FieldConfig;
}

createFieldConfig(PHONE_NUMBER_LABEL, PHONE_NUMBER, ControlEnum.Input, FIELD_IS_REQUIRED, FIELD_IS_DISABLED);
createFieldConfig(DIALED_DESCRIPTION_LABEL, DIALED_DESCRIPTION, ControlEnum.Input, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED);
createFieldConfig(CALL_FLOW_TEMPLATE_LABEL, CALL_FLOW_TEMPLATE, ControlEnum.Input, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED);
createFieldConfig(CHANNEL_LABEL, CHANNEL, ControlEnum.Select, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED);
createFieldConfig(BRAND_LABEL, BRAND, ControlEnum.Select, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED);
createFieldConfig(LANGUAGE_OFFER_LABEL, LANGUAGE_OFFER, ControlEnum.Select, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED);
createFieldConfig(DATA_REQUESTS_LABEL, DATA_REQUESTS, ControlEnum.AutoComplete, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.ARRAY, undefined, USER_IS_ABLE_TO_CHANGE_CONTROL, 10);
createFieldConfig(CALLER_TYPE_LABEL, CALLER_TYPE, ControlEnum.AutoComplete, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING, undefined, USER_IS_ABLE_TO_CHANGE_CONTROL, 10);
createFieldConfig(PHONE_NUMBER_TYPE, PHONE_NUMBER_TYPE, ControlEnum.AutoComplete, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED);
createFieldConfig(TRANSFER_DESTINATION_LABEL, TRANSFER_DESTINATION, ControlEnum.Input, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED);
createFieldConfig(CALL_FLOW_ROUTE_LABEL, CALL_FLOW_ROUTE, ControlEnum.AutoComplete, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING, undefined, USER_IS_ABLE_TO_CHANGE_CONTROL, 10);
createFieldConfig(GREETING_MESSAGES_LABEL, GREETING_MESSAGES, ControlEnum.Input, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED);
createFieldConfig(EMPLOYEE_ID_LABEL, EMPLOYEE_ID, ControlEnum.Input, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED);
createFieldConfig(CALL_TYPE_DESCRIPTION_LABEL, CALL_TYPE_DESCRIPTION, ControlEnum.Input, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED);
createFieldConfig(TRANSFER_CODE_LABEL, TRANSFER_CODE, ControlEnum.Input, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED);
createFieldConfig(INTERNET_PLACEMENT_LABEL, INTERNET_PLACEMENT, ControlEnum.Input, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED);
createFieldConfig(LINE_OF_BUSINESS_LABEL, LINE_OF_BUSINESS, ControlEnum.Input, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createFieldConfig(MARKETING_CHANNEL_LABEL, MARKETING_CHANNEL, ControlEnum.Input, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createFieldConfig(WHISPER_LABEL, WHISPER, ControlEnum.Input, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createFieldConfig(REQUEST_ID_LABEL, REQUEST_ID, ControlEnum.Input, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createFieldConfig(RANGE_INDICATOR_LABEL, RANGE_INDICATOR, ControlEnum.Input, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createFieldConfig(CALL_INTENT_LABEL, CALL_INTENT, ControlEnum.Input, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED);
createFieldConfig(OFFICE_NUMBERS_LABEL, OFFICE_NUMBERS, ControlEnum.MultiTextField, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED);
createFieldConfig(TFN_ROUTING_GROUP_LABEL, TFN_ROUTING_GROUP, ControlEnum.Select, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED);
createFieldConfig(PREDICTIVE_CALLER_LABEL, PREDICTIVE_CALLER, ControlEnum.Switch, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createFieldConfig(CALL_FLOW_TYPE_LABEL, CALL_FLOW_TYPE, ControlEnum.AutoComplete, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED);
createFieldConfig(CALL_FLOW_TEMPLATE_LABEL, CALL_FLOW_TEMPLATE, ControlEnum.AutoComplete, FIELD_IS_NOT_REQUIRED, FIELD_IS_NOT_DISABLED,FieldDataTypeEnum.STRING);
createFieldConfig(NEXT_ACTION_ID_LABEL, NEXT_ACTION_ID, ControlEnum.Input, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED);
createFieldConfig(NEXT_ACTION_TYPE_LABEL, NEXT_ACTION_TYPE, ControlEnum.AutoComplete, FIELD_IS_REQUIRED, FIELD_IS_NOT_DISABLED);

Object.freeze(DynamicPhoneNumberFormFieldConfigs);

