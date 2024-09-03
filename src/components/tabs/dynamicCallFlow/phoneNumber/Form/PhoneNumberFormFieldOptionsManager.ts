import {
  AbstractFormFieldOptionsManager,
  FieldOptions
} from "components/tabs/dynamicCallFlow/common/Form/AbstractFormFieldOptionsManager";
import {
  BRAND,
  CALL_FLOW_ROUTE,
  CALL_FLOW_TEMPLATE,
  CALLER_TYPE,
  CHANNEL,
  DATA_REQUESTS
} from "components/tabs/dynamicCallFlow/phoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import {
  CallFlowNameTypeEnum,
  CallFlowTypeEnum,
  LanguageOfferTypeEnum,
  PhoneNumberRecordType, PhoneNumberTypeEnum,
  TfnRoutingGroupEnum,
  UserDestinationEnum
} from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { PhoneNumberRecordUtil } from "components/tabs/dynamicCallFlow/phoneNumber/GraphQL/PhoneNumber.Record.Util";
import { FieldDataType } from "components/tabs/dynamicCallFlow/common/Form/Form.Interfaces";
import { ActionTypeEnum } from "components/tabs/dynamicCallFlow/common/GraphQL/DynamicCallFlow.Interfaces";

export class PhoneNumberFormFieldOptionsManager extends AbstractFormFieldOptionsManager<PhoneNumberRecordType> {
  getRecordPropertyValue(phoneNumberRecord: PhoneNumberRecordType, key: string): FieldDataType {
    return PhoneNumberRecordUtil.getPropertyValue(phoneNumberRecord, key);
  }

  getFieldOptionsCacheKey(): string {
    return "DYNAMIC_CALL_FLOW_PHONE_NUMBER_FORM_FIELD_OPTIONS";
  }

  getDataDrivenOptionsFieldNames(): Array<string> {
    return [BRAND, CALL_FLOW_ROUTE, CALL_FLOW_TEMPLATE, CALLER_TYPE, CHANNEL, DATA_REQUESTS];
  }

  getDataDrivenOptionsFieldNamesWithList(): Array<string> {
    return [DATA_REQUESTS];
  }

  getStaticFieldOptions(): FieldOptions {
    return {
      languageOffer: Object.values<string>(LanguageOfferTypeEnum),
      userDestination: Object.values<string>(UserDestinationEnum),
      callFlowName: Object.values<string>(CallFlowNameTypeEnum),
      callFlowType: Object.values<string>(CallFlowTypeEnum),
      nextActionType: Object.values<string>(ActionTypeEnum),
      tfnRoutingGroup: Object.values<string>(TfnRoutingGroupEnum),
      phoneNumberType: Object.values<string>(PhoneNumberTypeEnum),
      type: Object.values<string>(PhoneNumberTypeEnum)
    } as FieldOptions;
  }
}