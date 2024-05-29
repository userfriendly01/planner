import {
  AbstractFormFieldOptions, FieldOptions
} from "../../common/Form/AbstractForm.FieldOptions";
import {
  BRAND,
  CALL_FLOW_ROUTE,
  CALL_FLOW_TEMPLATE,
  CALLER_TYPE,
  CHANNEL,
  DATA_REQUESTS
} from "./DynamicPhoneNumberForm.Fields";
import { PKEY } from "./LegacyPhoneNumberForm.Fields";
import {
  CallFlowNameEnum, CallFlowTypeEnum,
  LanguageOfferEnum, NextActionTypeEnum,
  PhoneNumberRecordType, TfnRoutingGroupEnum,
  UserDestinationEnum
} from "../GraphQL/DynamicPhoneNumber.Interfaces";
import { LegacyPhoneNumberTypeEnum } from "../GraphQL/LegacyPhoneNumber.Interfaces";
import { PhoneNumberRecordUtil } from "../GraphQL/PhoneNumberRecord.Util";
import { FieldDataType } from "../../common/Form/FormFieldConfig.State";

export class PhoneNumberFormFieldOptions extends AbstractFormFieldOptions<PhoneNumberRecordType> {
  protected getRecordKeyValue(phoneNumberRecord: PhoneNumberRecordType, key: string): string | Array<string> | undefined {
    const keyValue: FieldDataType = PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, key);

    if (!keyValue) {
      return undefined;
    }

    if (Array.isArray(keyValue)) {
      return keyValue as Array<string>;
    }

    return keyValue as string;
  }

  protected getFieldOptionsCacheKey(): string {
    return "DYNAMIC_CALL_FLOW_PHONE_NUMBER_FORM_FIELD_OPTIONS";
  }

  protected getDataDrivenOptionsFieldNames(): Array<string> {
    return [BRAND, CALL_FLOW_ROUTE, CALL_FLOW_TEMPLATE, CALLER_TYPE, CHANNEL, DATA_REQUESTS, PKEY];
  }

  protected getDataDrivenOptionsFieldNamesWithList(): Array<string> {
    return [DATA_REQUESTS];
  }

  protected getStaticFieldOptions(): FieldOptions {
    return {
      languageOffer: Object.values<string>(LanguageOfferEnum),
      userDestination: Object.values<string>(UserDestinationEnum),
      callFlowName: Object.values<string>(CallFlowNameEnum),
      callFlowType: Object.values<string>(CallFlowTypeEnum),
      nextActionType: Object.values<string>(NextActionTypeEnum),
      tfnRoutingGroup: Object.values<string>(TfnRoutingGroupEnum),
      phoneNumberType: Object.values<string>(LegacyPhoneNumberTypeEnum)
    } as FieldOptions;
  }
}