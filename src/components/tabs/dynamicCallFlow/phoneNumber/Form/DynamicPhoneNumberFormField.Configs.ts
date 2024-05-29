import {
  BrandEnum,
  CallFlowTypeEnum,
  ChannelEnum,
  PhoneNumberRecordType,
  PhoneNumberTypeEnum
} from "../GraphQL/DynamicPhoneNumber.Interfaces";
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
} from "./DynamicPhoneNumberForm.Fields";
import { Control } from "../../../../../globals";
import {
  FieldConditionCheckType,
  FormFieldConfig,
  FormFieldConfigs,
  FieldDataTypeEnum,
  USER_CAN_SWITCH_TO_INPUT_CONTROL
} from "../../common/Form/FormFieldConfig.State";
import { ControlEnum } from "../../common/Form/FormField.Control";

const drcFieldConditionCheck: FieldConditionCheckType = (phoneNumberRecord: PhoneNumberRecordType): boolean => {
  return phoneNumberRecord[BRAND as keyof PhoneNumberRecordType] === BrandEnum.LIBERTY_MUTUAL
    && phoneNumberRecord[CHANNEL as keyof PhoneNumberRecordType] === ChannelEnum.SALES;
};

const didFieldConditionCheck: FieldConditionCheckType = (phoneNumberRecord: PhoneNumberRecordType): boolean => {
  return phoneNumberRecord[PHONE_NUMBER_TYPE as keyof PhoneNumberRecordType] === PhoneNumberTypeEnum.DID;
};

const dtmfFieldConditionCheck: FieldConditionCheckType = (phoneNumberRecord: PhoneNumberRecordType): boolean => {
  return phoneNumberRecord[CALL_FLOW_TYPE as keyof PhoneNumberRecordType] === CallFlowTypeEnum.DTMF;
};


export const DynamicPhoneNumberFormFieldConfigs: FormFieldConfigs = {};
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
function createDynamicPhoneNumberFormFieldConfig(label: string, fieldKey: string, control: Control, required: boolean, disableEdit: boolean, dataType = FieldDataTypeEnum.STRING, fieldConditionCheck?: FieldConditionCheckType, isUserAbleToChangeControl = false, gridSize?: number): void {
  if (required) {
    RequiredPhoneNumberFormFields.push(fieldKey);
  }

  DynamicPhoneNumberFormFieldConfigs[fieldKey] = {
    label,
    fieldKey,
    control,
    originalControl: control,
    currentControl: control,
    isUserAbleToChangeControl: isUserAbleToChangeControl,
    required,
    disableEdit,
    dataType,
    fieldConditionCheck: fieldConditionCheck,
    gridSize
  } as FormFieldConfig;
}

createDynamicPhoneNumberFormFieldConfig("Dialed Phone Number", PHONE_NUMBER, ControlEnum.Input, true, true);
createDynamicPhoneNumberFormFieldConfig("Description", DIALED_DESCRIPTION, ControlEnum.Input, true, false);
createDynamicPhoneNumberFormFieldConfig("Call Flow Template", CALL_FLOW_TEMPLATE, ControlEnum.Input, true, false);
createDynamicPhoneNumberFormFieldConfig("Channel", CHANNEL, ControlEnum.Select, true, false);
createDynamicPhoneNumberFormFieldConfig("Brand", BRAND, ControlEnum.Select, true, false);
createDynamicPhoneNumberFormFieldConfig("Language Offer", LANGUAGE_OFFER, ControlEnum.Select, true, false);
createDynamicPhoneNumberFormFieldConfig("Data Requests", DATA_REQUESTS, ControlEnum.AutoComplete, true, false, FieldDataTypeEnum.STRING_ARRAY, undefined, USER_CAN_SWITCH_TO_INPUT_CONTROL, 10);
createDynamicPhoneNumberFormFieldConfig("Caller Type", CALLER_TYPE, ControlEnum.AutoComplete, true, false, FieldDataTypeEnum.STRING, undefined, USER_CAN_SWITCH_TO_INPUT_CONTROL, 10);
createDynamicPhoneNumberFormFieldConfig("Phone Number Type", PHONE_NUMBER_TYPE, ControlEnum.AutoComplete, false, false);
createDynamicPhoneNumberFormFieldConfig("Transfer Destination", TRANSFER_DESTINATION, ControlEnum.Input, true, false);
createDynamicPhoneNumberFormFieldConfig("Call Flow Route", CALL_FLOW_ROUTE, ControlEnum.AutoComplete, true, false, FieldDataTypeEnum.STRING, undefined, USER_CAN_SWITCH_TO_INPUT_CONTROL, 10);
createDynamicPhoneNumberFormFieldConfig("Greeting", GREETING_MESSAGES, ControlEnum.Input, true, false);
createDynamicPhoneNumberFormFieldConfig("Employee ID", EMPLOYEE_ID, ControlEnum.Input, false, false);
createDynamicPhoneNumberFormFieldConfig("Call Type Description", CALL_TYPE_DESCRIPTION, ControlEnum.Input, false, false);
createDynamicPhoneNumberFormFieldConfig("Transfer Code", TRANSFER_CODE, ControlEnum.Input, false, false);
createDynamicPhoneNumberFormFieldConfig("Internet Placement", INTERNET_PLACEMENT, ControlEnum.Input, false, false);
createDynamicPhoneNumberFormFieldConfig("Line Of Business", LINE_OF_BUSINESS, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createDynamicPhoneNumberFormFieldConfig("Marketing Channel", MARKETING_CHANNEL, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createDynamicPhoneNumberFormFieldConfig("Whisper", WHISPER, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createDynamicPhoneNumberFormFieldConfig("Request ID", REQUEST_ID, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createDynamicPhoneNumberFormFieldConfig("Range Indicator", RANGE_INDICATOR, ControlEnum.Input, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createDynamicPhoneNumberFormFieldConfig("Call Intent", CALL_INTENT, ControlEnum.Input, false, false);
createDynamicPhoneNumberFormFieldConfig("Office Numbers", OFFICE_NUMBERS, ControlEnum.MultiTextField, false, false);
createDynamicPhoneNumberFormFieldConfig("TFN Routing Group", TFN_ROUTING_GROUP, ControlEnum.Select, false, false);
createDynamicPhoneNumberFormFieldConfig("Predictive Caller", PREDICTIVE_CALLER, ControlEnum.Switch, false, false, FieldDataTypeEnum.STRING, drcFieldConditionCheck);
createDynamicPhoneNumberFormFieldConfig("Call Flow Type", CALL_FLOW_TYPE, ControlEnum.AutoComplete, false, false);
createDynamicPhoneNumberFormFieldConfig("Call Flow Template", CALL_FLOW_TEMPLATE, ControlEnum.AutoComplete, false, false,FieldDataTypeEnum.STRING,  dtmfFieldConditionCheck);
createDynamicPhoneNumberFormFieldConfig("Next Action ID", NEXT_ACTION_ID, ControlEnum.Input, false, false);
createDynamicPhoneNumberFormFieldConfig("Next Action Type", NEXT_ACTION_TYPE, ControlEnum.AutoComplete, false, false);

Object.freeze(DynamicPhoneNumberFormFieldConfigs);

