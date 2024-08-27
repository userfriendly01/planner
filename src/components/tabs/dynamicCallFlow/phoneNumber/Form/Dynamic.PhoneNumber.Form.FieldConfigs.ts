import {
  BrandTypeEnum,
  CallFlowTypeEnum,
  ChannelTypeEnum,
  PhoneNumber,
  PhoneNumberRecordType,
  PhoneNumberTypeEnum
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  BRAND,
  CALL_FLOW_ROUTE,
  CALL_FLOW_TEMPLATE,
  CALL_FLOW_TYPE,
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
  MARKETING_CHANNEL,
  NEXT_ACTION_ID,
  NEXT_ACTION_TYPE,
  OFFICE_NUMBERS,
  PHONE_NUMBER,
  PHONE_NUMBER_TYPE,
  PREDICTIVE_CALLER,
  RANGE_INDICATOR,
  REQUEST_ID,
  TFN_ROUTING_GROUP,
  TRANSFER_CODE,
  TRANSFER_DESTINATION,
  WHISPER
} from "components/tabs/dynamicCallFlow/phoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import {
  ControlEnum,
  FieldConditionCheckType,
  FieldConfig,
  FieldConfigs,
  FieldDataTypeEnum,
  USER_IS_ABLE_TO_CHANGE_CONTROL
} from "components/tabs/dynamicCallFlow/common/Form/Form.Interfaces";

import { Control } from "globals/interfaces";

export const drcFieldConditionCheck: FieldConditionCheckType = (phoneNumberRecord: PhoneNumber): boolean => {
  return phoneNumberRecord?.brand === BrandTypeEnum.LIBERTY_MUTUAL
    && phoneNumberRecord?.channel === ChannelTypeEnum.SALES
    && phoneNumberRecord?.phoneNumberType === PhoneNumberTypeEnum.DRC;
};

export const didFieldConditionCheck: FieldConditionCheckType = (phoneNumberRecord: PhoneNumber): boolean => {
  return phoneNumberRecord?.phoneNumberType === PhoneNumberTypeEnum.DID;
};

export const dtmfFieldConditionCheck: FieldConditionCheckType = (phoneNumberRecord: PhoneNumber): boolean => {
  return phoneNumberRecord?.callFlowType === CallFlowTypeEnum.DTMF;
};

export const defaultFieldConditionCheck: FieldConditionCheckType = (record: PhoneNumberRecordType): boolean => {
  return !record ? false : true;
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
 *
 */
function createFieldConfig(label: string, fieldKey: string, control: Control, required: boolean, disableEdit: boolean, dataType = FieldDataTypeEnum.STRING, fieldConditionCheck?: FieldConditionCheckType, isUserAbleToChangeControl = false, gridSize?: number): void {
  if (required) {
    RequiredFieldsPhoneNumberForm.push(fieldKey);
  }

  DynamicPhoneNumberFormFieldConfigs[fieldKey] = {
    label,
    fieldKey,
    originalControl: control,
    currentControl: control,
    isUserAbleToChangeControl: isUserAbleToChangeControl,
    required,
    disableEdit,
    dataType,
    fieldConditionCheck: fieldConditionCheck || defaultFieldConditionCheck,
    gridSize
  } as FieldConfig;
}

createFieldConfig("Dialed Phone Number", PHONE_NUMBER, ControlEnum.Input, true, true);
createFieldConfig("Description", DIALED_DESCRIPTION, ControlEnum.Input, true, false);
createFieldConfig("Call Flow Template", CALL_FLOW_TEMPLATE, ControlEnum.Input, true, false);
createFieldConfig("Channel", CHANNEL, ControlEnum.Select, true, false);
createFieldConfig("Brand", BRAND, ControlEnum.Select, true, false);
createFieldConfig("Language Offer", LANGUAGE_OFFER, ControlEnum.Select, true, false);
createFieldConfig("Data Requests", DATA_REQUESTS, ControlEnum.AutoComplete, true, false, FieldDataTypeEnum.ARRAY, undefined, USER_IS_ABLE_TO_CHANGE_CONTROL, 10);
createFieldConfig("Caller Type", CALLER_TYPE, ControlEnum.AutoComplete, true, false, FieldDataTypeEnum.STRING, undefined, USER_IS_ABLE_TO_CHANGE_CONTROL, 10);
createFieldConfig("Phone Number Type", PHONE_NUMBER_TYPE, ControlEnum.AutoComplete, false, false);
createFieldConfig("Transfer Destination", TRANSFER_DESTINATION, ControlEnum.Input, true, false);
createFieldConfig("Call Flow Route", CALL_FLOW_ROUTE, ControlEnum.AutoComplete, true, false, FieldDataTypeEnum.STRING, undefined, USER_IS_ABLE_TO_CHANGE_CONTROL, 10);
createFieldConfig("Greeting", GREETING_MESSAGES, ControlEnum.Input, true, false);
createFieldConfig("Employee ID", EMPLOYEE_ID, ControlEnum.Input, false, false);
createFieldConfig("Call Type Description", CALL_TYPE_DESCRIPTION, ControlEnum.Input, false, false);
createFieldConfig("Transfer Code", TRANSFER_CODE, ControlEnum.Input, false, false);
createFieldConfig("Internet Placement", INTERNET_PLACEMENT, ControlEnum.Input, false, false);
createFieldConfig("Line Of Business", LINE_OF_BUSINESS, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createFieldConfig("Marketing Channel", MARKETING_CHANNEL, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createFieldConfig("Whisper", WHISPER, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createFieldConfig("Request ID", REQUEST_ID, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createFieldConfig("Range Indicator", RANGE_INDICATOR, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createFieldConfig("Call Intent", CALL_INTENT, ControlEnum.Input, false, false);
createFieldConfig("Office Numbers", OFFICE_NUMBERS, ControlEnum.MultiTextField, false, false);
createFieldConfig("TFN Routing Group", TFN_ROUTING_GROUP, ControlEnum.Select, false, false);
createFieldConfig("Predictive Caller", PREDICTIVE_CALLER, ControlEnum.Switch, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createFieldConfig("Call Flow Type", CALL_FLOW_TYPE, ControlEnum.AutoComplete, true, false);
createFieldConfig("Call Flow Template", CALL_FLOW_TEMPLATE, ControlEnum.AutoComplete, false, false,FieldDataTypeEnum.STRING);
createFieldConfig("Next Action ID", NEXT_ACTION_ID, ControlEnum.Input, true, false);
createFieldConfig("Next Action Type", NEXT_ACTION_TYPE, ControlEnum.AutoComplete, true, false);

Object.freeze(DynamicPhoneNumberFormFieldConfigs);

