import {
  BrandTypeEnum,
  CallFlowTypeEnum,
  ChannelTypeEnum,
  PhoneNumberRecordType,
  PhoneNumberTypeEnum
} from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { LegacyPhoneNumberTypeEnum } from "dynamicCallFlowPhoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
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
  OFFICE_NUMBERS,
  PHONE_NUMBER_TYPE,
  PREDICTIVE_CALLER,
  RANGE_INDICATOR,
  REQUEST_ID,
  TFN_ROUTING_GROUP,
  TRANSFER_CODE,
  TRANSFER_DESTINATION,
  WHISPER
} from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import {
  ACCOUNT_MANAGER,
  AFFINITY_VDN,
  CALL_DETAILS_1,
  CALL_DETAILS_2,
  PKEY,
  SELF_SERVICE_INDICATOR,
  TRANSFER_NUMBER,
  TYPE, USER_DESTINATION
} from "dynamicCallFlowPhoneNumber/Form/Legacy.PhoneNumber.Form.Fields";
import {
  ControlEnum,
  FieldConditionCheckType,
  FieldConfig,
  FieldConfigs,
  FieldDataTypeEnum,
  USER_IS_ABLE_TO_CHANGE_CONTROL
} from "dynamicCallFlowCommon/Form/Form.Interfaces";

import { Control } from "globals/interfaces";


const drcFieldConditionCheck: FieldConditionCheckType = (record: PhoneNumberRecordType): boolean => {
  return record[BRAND as keyof PhoneNumberRecordType] === BrandTypeEnum.LIBERTY_MUTUAL
    && record[CHANNEL as keyof PhoneNumberRecordType] === ChannelTypeEnum.SALES
    && record[TYPE as keyof PhoneNumberRecordType] === LegacyPhoneNumberTypeEnum.DRC;
};

const didFieldConditionCheck: FieldConditionCheckType = (record: PhoneNumberRecordType): boolean => {
  return record[TYPE as keyof PhoneNumberRecordType] === PhoneNumberTypeEnum.DID;
};

const dtmfFieldConditionCheck: FieldConditionCheckType = (record: PhoneNumberRecordType): boolean => {
  return record[CALL_FLOW_TYPE as keyof PhoneNumberRecordType] === CallFlowTypeEnum.DTMF ||
    record[SELF_SERVICE_INDICATOR as keyof PhoneNumberRecordType] === true;
};

const defaultFieldConditionCheck: FieldConditionCheckType = (record: PhoneNumberRecordType): boolean => {
  return true;
};


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
function createFieldConfig(label: string, fieldKey: string, control: Control, required = false, disableEdit = false, dataType = FieldDataTypeEnum.STRING, fieldConditionCheck?: FieldConditionCheckType, isUserAbleToChangeControl = false, gridSize?: number): void {
  if (required) {
    RequiredPhoneNumberFormFields.push(fieldKey);
  }

  LegacyPhoneNumberFormFieldConfigs[fieldKey] = {
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

createFieldConfig("Dialed Phone Number", PKEY, ControlEnum.Input, true, true, FieldDataTypeEnum.STRING);
createFieldConfig("Description", DIALED_DESCRIPTION, ControlEnum.Input, true, false, FieldDataTypeEnum.STRING);
createFieldConfig("Call Flow Template", CALL_FLOW_TEMPLATE, ControlEnum.Input, true, false, FieldDataTypeEnum.STRING);
createFieldConfig("Channel", CHANNEL, ControlEnum.Select, true, false, FieldDataTypeEnum.STRING);
createFieldConfig("Brand", BRAND, ControlEnum.Select, true, false, FieldDataTypeEnum.STRING);
createFieldConfig("Language Offer", LANGUAGE_OFFER, ControlEnum.Select, true, false, FieldDataTypeEnum.STRING);
createFieldConfig("Data Requests", DATA_REQUESTS, ControlEnum.AutoComplete, true, false, FieldDataTypeEnum.STRING_ARRAY, undefined, USER_IS_ABLE_TO_CHANGE_CONTROL, 10);
createFieldConfig("Caller Type", CALLER_TYPE, ControlEnum.AutoComplete, true, false, FieldDataTypeEnum.STRING, undefined, USER_IS_ABLE_TO_CHANGE_CONTROL, 10);
createFieldConfig("Phone Number Type", TYPE, ControlEnum.AutoComplete, false, false);
createFieldConfig("Dynamic Phone Number Type", PHONE_NUMBER_TYPE, ControlEnum.AutoComplete);
createFieldConfig("Transfer Number", TRANSFER_NUMBER, ControlEnum.Input, true, false);
createFieldConfig("Dynamic Transfer Destination", TRANSFER_DESTINATION, ControlEnum.Input, true, false);
createFieldConfig("Call Flow Route", CALL_FLOW_ROUTE, ControlEnum.AutoComplete, true, false, FieldDataTypeEnum.STRING, undefined, USER_IS_ABLE_TO_CHANGE_CONTROL, 10);
createFieldConfig("Greeting", GREETING_MESSAGES, ControlEnum.Input, true, false);
createFieldConfig("Employee ID", EMPLOYEE_ID, ControlEnum.Input);
createFieldConfig("Account Manager", ACCOUNT_MANAGER, ControlEnum.Input);
createFieldConfig("Affinity VDN", AFFINITY_VDN, ControlEnum.Input);
createFieldConfig("Call Type Description", CALL_TYPE_DESCRIPTION, ControlEnum.Input);
createFieldConfig("Transfer Code", TRANSFER_CODE, ControlEnum.Input);
createFieldConfig("Internet Placement", INTERNET_PLACEMENT, ControlEnum.Input);
createFieldConfig("Call Details 1", CALL_DETAILS_1, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createFieldConfig("Call Details 2", CALL_DETAILS_2, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createFieldConfig("Line Of Business", LINE_OF_BUSINESS, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createFieldConfig("Marketing Channel", MARKETING_CHANNEL, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createFieldConfig("Whisper", WHISPER, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createFieldConfig("Request ID", REQUEST_ID, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createFieldConfig("User Destination", USER_DESTINATION, ControlEnum.Select, false, false, FieldDataTypeEnum.STRING, didFieldConditionCheck);
createFieldConfig("Range Indicator", RANGE_INDICATOR, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createFieldConfig("Call Intent", CALL_INTENT, ControlEnum.Input);
createFieldConfig("Office Numbers", OFFICE_NUMBERS, ControlEnum.MultiTextField, false, false, FieldDataTypeEnum.STRING_ARRAY);
createFieldConfig("TFN Routing Group", TFN_ROUTING_GROUP, ControlEnum.Select, false, false, FieldDataTypeEnum.STRING);
createFieldConfig("Predictive Caller", PREDICTIVE_CALLER, ControlEnum.Switch, false, false, FieldDataTypeEnum.BOOLEAN, drcFieldConditionCheck);
createFieldConfig("Call Flow Type", CALL_FLOW_TYPE, ControlEnum.AutoComplete, false, false, FieldDataTypeEnum.STRING);
createFieldConfig("Self Service Indicator", SELF_SERVICE_INDICATOR, ControlEnum.AutoComplete, false, false, FieldDataTypeEnum.STRING);
createFieldConfig("Call Flow Template", CALL_FLOW_TEMPLATE, ControlEnum.AutoComplete, false, false, FieldDataTypeEnum.STRING, dtmfFieldConditionCheck);

Object.freeze(LegacyPhoneNumberFormFieldConfigs);

