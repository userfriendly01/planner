import { FormValidationRule } from "../../../../utils/interfaces";
import { PhoneNumberRecordType } from "../GraphQL/DynamicPhoneNumber.Interfaces";
import { PhoneNumberRecordUtil } from "../GraphQL/Util/PhoneNumberRecordUtil";
import { DynamicPhoneNumberFields } from "../Field/DynamicPhoneNumberFields";
import {
  LegacyPhoneNumberContentFields,
  LegacyPhoneNumberFields
} from "../Field/LegacyPhoneNumberFields";
import { FormFields } from "../../../../common/FormField/FormField.Interfaces";

export function convertFormFieldToPhoneNumberRecord(formFields: FormFields): PhoneNumberRecordType {
  if ("dataRequests" in formFields) {
    formFields.dataRequests.value = (formFields?.dataRequests?.value as string)
      ?.split(",")
      ?.map(a => a.trim())
      ?.filter(a => a.length > 0);
  }

  if (PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(formFields)) {
    return convertRuleToLegacyPhoneNumberRecord(formFields);
  } else {
    return convertFormFieldToDynamicPhoneNumberRecord(formFields);
  }
}

function convertFormFieldToDynamicPhoneNumberRecord(formFields: FormFields): PhoneNumberRecordType {
  const dynamicCallFlowRecord: { [key: string]: any } = {};

  DynamicPhoneNumberFields.forEach((key: string) => {
    if (key in formFields) {
      dynamicCallFlowRecord[key] = formFields[key as keyof FormFields].value;
    }
  });

  return dynamicCallFlowRecord;
}

function convertRuleToLegacyPhoneNumberRecord(formFields: FormFields): PhoneNumberRecordType {
  const legacyCallFlowRecord: { [key: string]: any } = {
    content: {}
  };

  LegacyPhoneNumberContentFields.forEach( (key: string) => {
    if (key in formFields) {
      legacyCallFlowRecord.content[key] = formFields[key as keyof FormValidationRule].value;
    }
  });

  LegacyPhoneNumberFields.forEach((key: string) => {
    if (!(key in LegacyPhoneNumberContentFields) && key in formFields) {
      legacyCallFlowRecord[key] = formFields[key as keyof FormValidationRule].value;
    }
  });

  return legacyCallFlowRecord;
}