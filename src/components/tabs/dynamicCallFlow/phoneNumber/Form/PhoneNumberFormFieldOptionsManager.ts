import {
  AbstractFormFieldOptionsManager,
  FieldOptions
} from "dynamicCallFlowCommon/Form/AbstractFormFieldOptionsManager";
import {
  BRAND,
  CALL_FLOW_ROUTE,
  CALL_FLOW_TEMPLATE,
  CALLER_TYPE,
  CHANNEL,
  DATA_REQUESTS
} from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import { PKEY } from "dynamicCallFlowPhoneNumber/Form/Legacy.PhoneNumber.Form.Fields";
import {
  CallFlowNameTypeEnum,
  CallFlowTypeEnum,
  LanguageOfferTypeEnum,
  PhoneNumberRecordType,
  TfnRoutingGroupEnum,
  UserDestinationEnum
} from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { LegacyPhoneNumberTypeEnum } from "dynamicCallFlowPhoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
import { PhoneNumberRecordUtil } from "dynamicCallFlowPhoneNumber/GraphQL/PhoneNumber.Record.Util";
import { FieldDataType } from "dynamicCallFlowCommon/Form/Form.Interfaces";
import { ActionTypeEnum } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";

export class PhoneNumberFormFieldOptionsManager extends AbstractFormFieldOptionsManager<PhoneNumberRecordType> {
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
      languageOffer: Object.values<string>(LanguageOfferTypeEnum),
      userDestination: Object.values<string>(UserDestinationEnum),
      callFlowName: Object.values<string>(CallFlowNameTypeEnum),
      callFlowType: Object.values<string>(CallFlowTypeEnum),
      nextActionType: Object.values<string>(ActionTypeEnum),
      tfnRoutingGroup: Object.values<string>(TfnRoutingGroupEnum),
      phoneNumberType: Object.values<string>(LegacyPhoneNumberTypeEnum)
    } as FieldOptions;
  }
}