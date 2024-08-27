import {
  BrandTypeEnum,
  ChannelTypeEnum,
  PhoneNumberTypeEnum
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
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
  WHISPER
} from "components/tabs/dynamicCallFlow/phoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import {
  ACCOUNT_MANAGER,
  AFFINITY_VDN,
  CALL_DETAILS_1,
  CALL_DETAILS_2,
  PKEY,
  SELF_SERVICE_INDICATOR,
  TRANSFER_NUMBER,
  TYPE, USER_DESTINATION
} from "components/tabs/dynamicCallFlow/phoneNumber/Form/Legacy.PhoneNumber.Form.Fields";
import {
  ControlEnum,
  FieldConditionCheckType,
  FieldConfig,
  FieldConfigs,
  FieldDataTypeEnum,
  USER_IS_ABLE_TO_CHANGE_CONTROL
} from "components/tabs/dynamicCallFlow/common/Form/Form.Interfaces";

import { Control } from "globals/interfaces";
import { CctSharedCallFlowDb } from "dynamicCallFlowPhoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
import { defaultFieldConditionCheck } from "dynamicCallFlowAction/Form/ActionFieldsConfig";

export const legacyDrcFieldConditionCheck: FieldConditionCheckType = (record: CctSharedCallFlowDb): boolean => {
  return record.brand === BrandTypeEnum.LIBERTY_MUTUAL
    && record.channel === ChannelTypeEnum.SALES
    && record.type === PhoneNumberTypeEnum.DRC;
};

export const legacyDidFieldConditionCheck: FieldConditionCheckType = (record: CctSharedCallFlowDb): boolean => {
  return record.type === PhoneNumberTypeEnum.DID;
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
createFieldConfig("Data Requests", DATA_REQUESTS, ControlEnum.AutoComplete, true, false, FieldDataTypeEnum.ARRAY, undefined, USER_IS_ABLE_TO_CHANGE_CONTROL, 10);
createFieldConfig("Caller Type", CALLER_TYPE, ControlEnum.AutoComplete, true, false, FieldDataTypeEnum.STRING, undefined, USER_IS_ABLE_TO_CHANGE_CONTROL, 10);
createFieldConfig("Phone Number Type", TYPE, ControlEnum.AutoComplete, false, false);
createFieldConfig("Transfer Number", TRANSFER_NUMBER, ControlEnum.Input, true, false);
createFieldConfig("Call Flow Route", CALL_FLOW_ROUTE, ControlEnum.AutoComplete, true, false, FieldDataTypeEnum.STRING, undefined, USER_IS_ABLE_TO_CHANGE_CONTROL, 10);
createFieldConfig("Greeting", GREETING_MESSAGES, ControlEnum.Input, true, false);
createFieldConfig("Employee ID", EMPLOYEE_ID, ControlEnum.Input);
createFieldConfig("Account Manager", ACCOUNT_MANAGER, ControlEnum.Input);
createFieldConfig("Affinity VDN", AFFINITY_VDN, ControlEnum.Input);
createFieldConfig("Call Type Description", CALL_TYPE_DESCRIPTION, ControlEnum.Input);
createFieldConfig("Transfer Code", TRANSFER_CODE, ControlEnum.Input);
createFieldConfig("Internet Placement", INTERNET_PLACEMENT, ControlEnum.Input);
createFieldConfig("Call Details 1", CALL_DETAILS_1, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, legacyDrcFieldConditionCheck);
createFieldConfig("Call Details 2", CALL_DETAILS_2, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, legacyDrcFieldConditionCheck);
createFieldConfig("Line Of Business", LINE_OF_BUSINESS, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, legacyDrcFieldConditionCheck);
createFieldConfig("Marketing Channel", MARKETING_CHANNEL, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, legacyDrcFieldConditionCheck);
createFieldConfig("Whisper", WHISPER, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, legacyDrcFieldConditionCheck);
createFieldConfig("Request ID", REQUEST_ID, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, legacyDrcFieldConditionCheck);
createFieldConfig("User Destination", USER_DESTINATION, ControlEnum.Select, false, false, FieldDataTypeEnum.STRING, legacyDidFieldConditionCheck);
createFieldConfig("Range Indicator", RANGE_INDICATOR, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, legacyDrcFieldConditionCheck);
createFieldConfig("Call Intent", CALL_INTENT, ControlEnum.Input);
createFieldConfig("Office Numbers", OFFICE_NUMBERS, ControlEnum.MultiTextField, false, false, FieldDataTypeEnum.ARRAY);
createFieldConfig("TFN Routing Group", TFN_ROUTING_GROUP, ControlEnum.Select, false, false, FieldDataTypeEnum.STRING);
createFieldConfig("Predictive Caller", PREDICTIVE_CALLER, ControlEnum.Switch, false, false, FieldDataTypeEnum.BOOLEAN, legacyDrcFieldConditionCheck);
createFieldConfig("Self Service Indicator", SELF_SERVICE_INDICATOR, ControlEnum.Switch, false, false, FieldDataTypeEnum.BOOLEAN, legacyDrcFieldConditionCheck);

Object.freeze(LegacyPhoneNumberFormFieldConfigs);

