import { FormValidationRule } from "../../../../utils/interfaces";
import {
  BrandEnum, CallFlowTypeEnum,
  ChannelEnum,
  PhoneNumberRecordType,
  PhoneNumberTypeEnum
} from "../GraphQL/DynamicPhoneNumber.Interfaces";
import {
  CctSharedCallFlowDb, FlowContent, LegacyPhoneNumberTypeEnum
} from "../GraphQL/LegacyPhoneNumber.Interfaces";
import {
  BRAND,
  CALL_FLOW_ROUTE,
  CALL_FLOW_TEMPLATE, CALL_FLOW_TYPE, CALL_INTENT,
  CALL_TYPE_DESCRIPTION,
  CALLER_TYPE,
  CHANNEL,
  CommonPhoneNumberFields,
  DATA_REQUESTS,
  DIALED_DESCRIPTION,
  EMPLOYEE_ID,
  GREETING_MESSAGES,
  INTERNET_PLACEMENT,
  LANGUAGE_OFFER,
  LINE_OF_BUSINESS,
  MARKETING_CHANNEL, NEXT_ACTION_ID, NEXT_ACTION_TYPE, OFFICE_NUMBERS,
  PHONE_NUMBER_TYPE,
  PREDICTIVE_CALLER, RANGE_INDICATOR, REQUEST_ID, TFN_ROUTING_GROUP,
  TRANSFER_CODE,
  TRANSFER_DESTINATION,
  USER_DESTINATION, WHISPER
} from "./DynamicPhoneNumberFields";
import { PhoneNumberRecordUtil } from "../GraphQL/Util/PhoneNumberRecordUtil";
import { Control } from "../../../../globals";
import {
  ACCOUNT_MANAGER,
  AFFINITY_VDN, CALL_DETAILS_1, CALL_DETAILS_2,
  PKEY,
  SELF_SERVICE_INDICATOR,
  TRANSFER_NUMBER,
  TYPE
} from "./LegacyPhoneNumberFields";
import {
  ControlEnum,
  DynamicFieldConditionCheckType,
  FormFieldConfig,
  FormFieldConfigs,
  USER_CAN_SWITCH_TO_INPUT_CONTROL
} from "../../../../common/FormField/FormField.Interfaces";

export type ValueGetterFunctionType = (phoneNumberRecord: PhoneNumberRecordType, key: string) => any;
export type ValueSetterFunctionType = (currentPhoneNumberRecord: PhoneNumberRecordType, newPropertyValue: any) => PhoneNumberRecordType;

const fieldValueGetter: ValueGetterFunctionType = (phoneNumberRecord: PhoneNumberRecordType, key: string): string => {
  if (PhoneNumberRecordUtil.isLegacyContentFieldKey(phoneNumberRecord, key)) {
    const cctSharedCallFlowDb = phoneNumberRecord as CctSharedCallFlowDb;
    return `${cctSharedCallFlowDb?.content[key as keyof FlowContent] || ""}`;
  } else {
    return `${phoneNumberRecord?.[key as keyof typeof phoneNumberRecord] || ""}`;
  }
};

const fieldValueSetter: ValueSetterFunctionType = (phoneNumberRecord: PhoneNumberRecordType, newPropertyValue: any): PhoneNumberRecordType => {
  if (newPropertyValue instanceof Object) {
    Object.keys(newPropertyValue).forEach((key: string) => {
      if (key in CommonPhoneNumberFields) {
        if (PhoneNumberRecordUtil.isLegacyContentFieldKey(phoneNumberRecord, key)) {
          return {
            ...phoneNumberRecord,
            content: {
              ...phoneNumberRecord["content" as keyof typeof phoneNumberRecord] as FlowContent || {},
              ...newPropertyValue
            }
          };
        } else {
          return {
            ...phoneNumberRecord,
            ...newPropertyValue
          };
        }
      }
    });
  }

  //TODO: log that value was not found in list of fields
  return phoneNumberRecord;
};

const drcDynamicFieldConditionCheck: DynamicFieldConditionCheckType = (formValidationRule: FormValidationRule): boolean => {
  return formValidationRule[BRAND]?.value === BrandEnum.LIBERTY_MUTUAL
    && formValidationRule[CHANNEL]?.value === ChannelEnum.SALES
    && formValidationRule[TYPE]?.value === LegacyPhoneNumberTypeEnum.DRC;
};

const didDynamicFieldConditionCheck: DynamicFieldConditionCheckType = (formValidationRule?: FormValidationRule): boolean => {
  return formValidationRule[TYPE]?.value === PhoneNumberTypeEnum.DID;
};

const dtmfDynamicFieldConditionCheck: DynamicFieldConditionCheckType = (formValidationRule: FormValidationRule): boolean => {
  return formValidationRule[CALL_FLOW_TYPE]?.value === CallFlowTypeEnum.DTMF ||
    formValidationRule[SELF_SERVICE_INDICATOR]?.value === true;
};


export const PhoneNumberFormFieldConfigs: FormFieldConfigs = {};
export const RequiredPhoneNumberFormFields: Array<string> = [];

/**
 *
 * @param {string} label
 * @param {string} key
 * @param {Control} control
 * @param {boolean} required
 * @param {boolean} disableEdit
 * @param {DynamicFieldConditionCheckType} dynamicFieldConditionCheck
 * @param {boolean} isUserAbleToSwitchToInputControl
 * @param {number} gridSize
 *
 */
function createPhoneNumberFormFieldConfig(label: string, key: string, control: Control, required: boolean, disableEdit: boolean, dynamicFieldConditionCheck?: DynamicFieldConditionCheckType, isUserAbleToSwitchToInputControl?: boolean, gridSize?: number): void {
  if (required) {
    RequiredPhoneNumberFormFields.push(key);
  }

  PhoneNumberFormFieldConfigs[key] = {
    label,
    key,
    control,
    isUserAbleToSwitchToInputControl: isUserAbleToSwitchToInputControl || false,
    required,
    disableEdit,
    dynamicFieldConditionCheck,
    gridSize
  } as FormFieldConfig;
}

createPhoneNumberFormFieldConfig("Dialed Phone Number", PKEY, ControlEnum.Input, true, true);
createPhoneNumberFormFieldConfig("Description", DIALED_DESCRIPTION, ControlEnum.Input, true, false);
createPhoneNumberFormFieldConfig("Call Flow Template", CALL_FLOW_TEMPLATE, ControlEnum.Input, true, false);
createPhoneNumberFormFieldConfig("Channel", CHANNEL, ControlEnum.Select, true, false);
createPhoneNumberFormFieldConfig("Brand", BRAND, ControlEnum.Select, true, false);
createPhoneNumberFormFieldConfig("Language Offer", LANGUAGE_OFFER, ControlEnum.Select, true, false);
createPhoneNumberFormFieldConfig("Data Requests", DATA_REQUESTS, ControlEnum.AutoComplete, true, false, undefined, USER_CAN_SWITCH_TO_INPUT_CONTROL, 10);
createPhoneNumberFormFieldConfig("Caller Type", CALLER_TYPE, ControlEnum.AutoComplete, true, false, undefined, USER_CAN_SWITCH_TO_INPUT_CONTROL, 10);
createPhoneNumberFormFieldConfig("Phone Number Type", TYPE, ControlEnum.AutoComplete, false, false);
createPhoneNumberFormFieldConfig("Dynamic Phone Number Type", PHONE_NUMBER_TYPE, ControlEnum.AutoComplete, false, false);
createPhoneNumberFormFieldConfig("Transfer Number", TRANSFER_NUMBER, ControlEnum.Input, true, false);
createPhoneNumberFormFieldConfig("Dynamic Transfer Destination", TRANSFER_DESTINATION, ControlEnum.Input, true, false);
createPhoneNumberFormFieldConfig("Call Flow Route", CALL_FLOW_ROUTE, ControlEnum.AutoComplete, true, false, undefined, USER_CAN_SWITCH_TO_INPUT_CONTROL, 10);
createPhoneNumberFormFieldConfig("Greeting", GREETING_MESSAGES, ControlEnum.Input, true, false);
createPhoneNumberFormFieldConfig("Employee ID", EMPLOYEE_ID, ControlEnum.Input, false, false);
createPhoneNumberFormFieldConfig("Account Manager", ACCOUNT_MANAGER, ControlEnum.Input, false, false);
createPhoneNumberFormFieldConfig("Affinity VDN", AFFINITY_VDN, ControlEnum.Input, false, false);
createPhoneNumberFormFieldConfig("Call Type Description", CALL_TYPE_DESCRIPTION, ControlEnum.Input, false, false);
createPhoneNumberFormFieldConfig("Transfer Code", TRANSFER_CODE, ControlEnum.Input, false, false);
createPhoneNumberFormFieldConfig("Internet Placement", INTERNET_PLACEMENT, ControlEnum.Input, false, false);
createPhoneNumberFormFieldConfig("Call Details 1", CALL_DETAILS_1, ControlEnum.Input, false, false, drcDynamicFieldConditionCheck);
createPhoneNumberFormFieldConfig("Call Details 2", CALL_DETAILS_2, ControlEnum.Input, false, false, drcDynamicFieldConditionCheck);
createPhoneNumberFormFieldConfig("Line Of Business", LINE_OF_BUSINESS, ControlEnum.Input, false, false, drcDynamicFieldConditionCheck);
createPhoneNumberFormFieldConfig("Marketing Channel", MARKETING_CHANNEL, ControlEnum.Input, false, false, drcDynamicFieldConditionCheck);
createPhoneNumberFormFieldConfig("Whisper", WHISPER, ControlEnum.Input, false, false, drcDynamicFieldConditionCheck);
createPhoneNumberFormFieldConfig("Request ID", REQUEST_ID, ControlEnum.Input, false, false, drcDynamicFieldConditionCheck);
createPhoneNumberFormFieldConfig("User Destination", USER_DESTINATION, ControlEnum.Select, false, false, didDynamicFieldConditionCheck);
createPhoneNumberFormFieldConfig("Range Indicator", RANGE_INDICATOR, ControlEnum.Input, false, false, drcDynamicFieldConditionCheck);
createPhoneNumberFormFieldConfig("Call Intent", CALL_INTENT, ControlEnum.Input, false, false);
createPhoneNumberFormFieldConfig("Office Numbers", OFFICE_NUMBERS, ControlEnum.MultiTextField, false, false);
createPhoneNumberFormFieldConfig("TFN Routing Group", TFN_ROUTING_GROUP, ControlEnum.Select, false, false);
createPhoneNumberFormFieldConfig("Predictive Caller", PREDICTIVE_CALLER, ControlEnum.Switch, false, false, drcDynamicFieldConditionCheck);
createPhoneNumberFormFieldConfig("Call Flow Type", CALL_FLOW_TYPE, ControlEnum.AutoComplete, false, false);
createPhoneNumberFormFieldConfig("Self Service Indicator", SELF_SERVICE_INDICATOR, ControlEnum.AutoComplete, false, false);
createPhoneNumberFormFieldConfig("Call Flow Template", CALL_FLOW_TEMPLATE, ControlEnum.AutoComplete, false, false, dtmfDynamicFieldConditionCheck);
createPhoneNumberFormFieldConfig("Next Action ID", NEXT_ACTION_ID, ControlEnum.Input, false, false);
createPhoneNumberFormFieldConfig("Next Action Type", NEXT_ACTION_TYPE, ControlEnum.AutoComplete, false, false);

Object.freeze(PhoneNumberFormFieldConfigs);

