import { PhoneNumberFormFieldOptionsManager } from "dynamicCallFlowPhoneNumber/Form/PhoneNumberFormFieldOptionsManager";
import {
  CallFlowNameTypeEnum, CallFlowTypeEnum,
  LanguageOfferTypeEnum,
  PhoneNumberRecordType, PhoneNumberTypeEnum, TfnRoutingGroupEnum, UserDestinationEnum
} from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { PhoneNumberRecordUtil } from "dynamicCallFlowPhoneNumber/GraphQL/PhoneNumber.Record.Util";
import {
  BRAND,
  CALL_FLOW_ROUTE,
  CALL_FLOW_TEMPLATE, CALLER_TYPE, CHANNEL,
  DATA_REQUESTS
} from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";
import { ActionTypeEnum } from "dynamicCallFlowCommon/GraphQL/DynamicCallFlow.Interfaces";

describe("PhoneNumberFormFieldOptionsManager", () => {
  it("shouldReturnCorrectRecordPropertyValue", () => {
    const manager = new PhoneNumberFormFieldOptionsManager();
    const mockRecord = {
      pkey: "123",
      phoneNumber: "1234567890"
    } as PhoneNumberRecordType;
    jest.spyOn(PhoneNumberRecordUtil, "getPropertyValue").mockReturnValue("1234567890");
    const result = manager.getRecordPropertyValue(mockRecord, "phoneNumber");
    expect(result).toBe("1234567890");
  });

  it("shouldReturnCorrectFieldOptionsCacheKey", () => {
    const manager = new PhoneNumberFormFieldOptionsManager();
    const result = manager.getFieldOptionsCacheKey();
    expect(result).toBe("DYNAMIC_CALL_FLOW_PHONE_NUMBER_FORM_FIELD_OPTIONS");
  });

  it("shouldReturnCorrectDataDrivenOptionsFieldNames", () => {
    const manager = new PhoneNumberFormFieldOptionsManager();
    const result = manager.getDataDrivenOptionsFieldNames();
    expect(result).toEqual([BRAND, CALL_FLOW_ROUTE, CALL_FLOW_TEMPLATE, CALLER_TYPE, CHANNEL, DATA_REQUESTS]);
  });

  it("shouldReturnCorrectDataDrivenOptionsFieldNamesWithList", () => {
    const manager = new PhoneNumberFormFieldOptionsManager();
    const result = manager.getDataDrivenOptionsFieldNamesWithList();
    expect(result).toEqual([DATA_REQUESTS]);
  });

  it("shouldReturnCorrectStaticFieldOptions", () => {
    const manager = new PhoneNumberFormFieldOptionsManager();
    const result = manager.getStaticFieldOptions();
    expect(result).toEqual({
      languageOffer: Object.values<string>(LanguageOfferTypeEnum),
      userDestination: Object.values<string>(UserDestinationEnum),
      callFlowName: Object.values<string>(CallFlowNameTypeEnum),
      callFlowType: Object.values<string>(CallFlowTypeEnum),
      nextActionType: Object.values<string>(ActionTypeEnum),
      tfnRoutingGroup: Object.values<string>(TfnRoutingGroupEnum),
      phoneNumberType: Object.values<string>(PhoneNumberTypeEnum),
      type: Object.values<string>(PhoneNumberTypeEnum)
    });
  });
});