import {
  BrandEnum,
  CallFlowTypeEnum,
  ChannelEnum,
  PhoneNumberRecordType,
  PhoneNumberTypeEnum
} from "../GraphQL/DynamicPhoneNumber.Interfaces";
import { LegacyPhoneNumberTypeEnum } from "../GraphQL/LegacyPhoneNumber.Interfaces";
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
  PHONE_NUMBER_TYPE,
  PREDICTIVE_CALLER,
  RANGE_INDICATOR,
  REQUEST_ID,
  TFN_ROUTING_GROUP,
  TRANSFER_CODE,
  TRANSFER_DESTINATION,
  WHISPER
} from "./DynamicPhoneNumberForm.Fields";
import { Control } from "../../../../../globals";
import {
  ACCOUNT_MANAGER,
  AFFINITY_VDN,
  CALL_DETAILS_1,
  CALL_DETAILS_2,
  PKEY,
  SELF_SERVICE_INDICATOR,
  TRANSFER_NUMBER,
  TYPE, USER_DESTINATION
} from "./LegacyPhoneNumberForm.Fields";
import {
  FieldConditionCheckType,
  FormFieldConfig,
  FormFieldConfigs,
  FieldDataTypeEnum,
  USER_CAN_SWITCH_TO_INPUT_CONTROL
} from "../../common/Form/FormFieldConfig.State";
import { ControlEnum } from "../../common/Form/FormField.Control";


const drcFieldConditionCheck: FieldConditionCheckType = (record: PhoneNumberRecordType): boolean => {
  return record[BRAND as keyof PhoneNumberRecordType] === BrandEnum.LIBERTY_MUTUAL
    && record[CHANNEL as keyof PhoneNumberRecordType] === ChannelEnum.SALES
    && record[TYPE as keyof PhoneNumberRecordType] === LegacyPhoneNumberTypeEnum.DRC;
};

const didFieldConditionCheck: FieldConditionCheckType = (record: PhoneNumberRecordType): boolean => {
  return record[TYPE as keyof PhoneNumberRecordType] === PhoneNumberTypeEnum.DID;
};

const dtmfFieldConditionCheck: FieldConditionCheckType = (record: PhoneNumberRecordType): boolean => {
  return record[CALL_FLOW_TYPE as keyof PhoneNumberRecordType] === CallFlowTypeEnum.DTMF ||
    record[SELF_SERVICE_INDICATOR as keyof PhoneNumberRecordType] === true;
};


export const LegacyPhoneNumberFormFieldConfigs: FormFieldConfigs = {};
export const RequiredPhoneNumberFormFields: Array<string> = [];

/**
 *
 * @param {string} label
 * @param {string} fieldKey
 * @param {Control} control
 * @param {boolean} required
 * @param {boolean} disableEdit
 * @param {FieldDataTypeEnum} dataType
 * @param {FieldConditionCheckType} dynamicFieldConditionCheck
 * @param {boolean} isUserAbleToChangeControl
 * @param {number} gridSize
 *
 */
function createPhoneNumberFormFieldConfig(label: string, fieldKey: string, control: Control, required = false, disableEdit = false, dataType = FieldDataTypeEnum.STRING, dynamicFieldConditionCheck?: FieldConditionCheckType, isUserAbleToChangeControl = false, gridSize?: number): void {
  if (required) {
    RequiredPhoneNumberFormFields.push(fieldKey);
  }

  LegacyPhoneNumberFormFieldConfigs[fieldKey] = {
    label,
    fieldKey,
    control,
    originalControl: control,
    currentControl: control,
    isUserAbleToChangeControl: isUserAbleToChangeControl,
    required,
    disableEdit,
    dataType,
    fieldConditionCheck: dynamicFieldConditionCheck,
    gridSize
  } as FormFieldConfig;
}

createPhoneNumberFormFieldConfig("Dialed Phone Number", PKEY, ControlEnum.Input, true, true, FieldDataTypeEnum.STRING);
createPhoneNumberFormFieldConfig("Description", DIALED_DESCRIPTION, ControlEnum.Input, true, false, FieldDataTypeEnum.STRING);
createPhoneNumberFormFieldConfig("Call Flow Template", CALL_FLOW_TEMPLATE, ControlEnum.Input, true, false, FieldDataTypeEnum.STRING);
createPhoneNumberFormFieldConfig("Channel", CHANNEL, ControlEnum.Select, true, false, FieldDataTypeEnum.STRING);
createPhoneNumberFormFieldConfig("Brand", BRAND, ControlEnum.Select, true, false, FieldDataTypeEnum.STRING);
createPhoneNumberFormFieldConfig("Language Offer", LANGUAGE_OFFER, ControlEnum.Select, true, false, FieldDataTypeEnum.STRING);
createPhoneNumberFormFieldConfig("Data Requests", DATA_REQUESTS, ControlEnum.AutoComplete, true, false, FieldDataTypeEnum.STRING_ARRAY, undefined, USER_CAN_SWITCH_TO_INPUT_CONTROL, 10);
createPhoneNumberFormFieldConfig("Caller Type", CALLER_TYPE, ControlEnum.AutoComplete, true, false, FieldDataTypeEnum.STRING, undefined, USER_CAN_SWITCH_TO_INPUT_CONTROL, 10);
createPhoneNumberFormFieldConfig("Phone Number Type", TYPE, ControlEnum.AutoComplete, false, false);
createPhoneNumberFormFieldConfig("Dynamic Phone Number Type", PHONE_NUMBER_TYPE, ControlEnum.AutoComplete);
createPhoneNumberFormFieldConfig("Transfer Number", TRANSFER_NUMBER, ControlEnum.Input, true, false);
createPhoneNumberFormFieldConfig("Dynamic Transfer Destination", TRANSFER_DESTINATION, ControlEnum.Input, true, false);
createPhoneNumberFormFieldConfig("Call Flow Route", CALL_FLOW_ROUTE, ControlEnum.AutoComplete, true, false, FieldDataTypeEnum.STRING, undefined, USER_CAN_SWITCH_TO_INPUT_CONTROL, 10);
createPhoneNumberFormFieldConfig("Greeting", GREETING_MESSAGES, ControlEnum.Input, true, false);
createPhoneNumberFormFieldConfig("Employee ID", EMPLOYEE_ID, ControlEnum.Input);
createPhoneNumberFormFieldConfig("Account Manager", ACCOUNT_MANAGER, ControlEnum.Input);
createPhoneNumberFormFieldConfig("Affinity VDN", AFFINITY_VDN, ControlEnum.Input);
createPhoneNumberFormFieldConfig("Call Type Description", CALL_TYPE_DESCRIPTION, ControlEnum.Input);
createPhoneNumberFormFieldConfig("Transfer Code", TRANSFER_CODE, ControlEnum.Input);
createPhoneNumberFormFieldConfig("Internet Placement", INTERNET_PLACEMENT, ControlEnum.Input);
createPhoneNumberFormFieldConfig("Call Details 1", CALL_DETAILS_1, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createPhoneNumberFormFieldConfig("Call Details 2", CALL_DETAILS_2, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createPhoneNumberFormFieldConfig("Line Of Business", LINE_OF_BUSINESS, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createPhoneNumberFormFieldConfig("Marketing Channel", MARKETING_CHANNEL, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createPhoneNumberFormFieldConfig("Whisper", WHISPER, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createPhoneNumberFormFieldConfig("Request ID", REQUEST_ID, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createPhoneNumberFormFieldConfig("User Destination", USER_DESTINATION, ControlEnum.Select, false, false, FieldDataTypeEnum.STRING, didFieldConditionCheck);
createPhoneNumberFormFieldConfig("Range Indicator", RANGE_INDICATOR, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createPhoneNumberFormFieldConfig("Call Intent", CALL_INTENT, ControlEnum.Input);
createPhoneNumberFormFieldConfig("Office Numbers", OFFICE_NUMBERS, ControlEnum.MultiTextField, false, false, FieldDataTypeEnum.STRING_ARRAY);
createPhoneNumberFormFieldConfig("TFN Routing Group", TFN_ROUTING_GROUP, ControlEnum.Select, false, false, FieldDataTypeEnum.STRING);
createPhoneNumberFormFieldConfig("Predictive Caller", PREDICTIVE_CALLER, ControlEnum.Switch, false, false, FieldDataTypeEnum.BOOLEAN, drcFieldConditionCheck);
createPhoneNumberFormFieldConfig("Call Flow Type", CALL_FLOW_TYPE, ControlEnum.AutoComplete, false, false, FieldDataTypeEnum.STRING);
createPhoneNumberFormFieldConfig("Self Service Indicator", SELF_SERVICE_INDICATOR, ControlEnum.AutoComplete, false, false, FieldDataTypeEnum.STRING);
createPhoneNumberFormFieldConfig("Call Flow Template", CALL_FLOW_TEMPLATE, ControlEnum.AutoComplete, false, false, FieldDataTypeEnum.STRING, dtmfFieldConditionCheck);

Object.freeze(LegacyPhoneNumberFormFieldConfigs);

