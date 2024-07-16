import { PhoneNumberRecordUtil } from "dynamicCallFlowPhoneNumber/GraphQL/PhoneNumber.Record.Util";
import { BrandTypeEnum, PhoneNumber } from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import { CctSharedCallFlowDb } from "dynamicCallFlowPhoneNumber/GraphQL/Legacy.PhoneNumber.Interfaces";
import { BRAND, GREETING_MESSAGES } from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.Fields";

describe("PhoneNumberRecordUtil", () => {
  let mockPhoneNumberRecord: PhoneNumber;
  let mockLegacyPhoneNumberRecord: CctSharedCallFlowDb;

  beforeEach(() => {
    mockPhoneNumberRecord = {
      phoneNumber: "1234567890",
      brand: BrandTypeEnum.SAFECO
    } as PhoneNumber;

    mockLegacyPhoneNumberRecord = {
      pkey: "1234567890",
      brand: BrandTypeEnum.SAFECO,
      content: {
        greetingMessages: "Hello"
      }
    } as CctSharedCallFlowDb;
  });

  it("shouldReturnCorrectPkeyForDynamicPhoneNumberRecord", () => {
    expect(PhoneNumberRecordUtil.getPkey(mockPhoneNumberRecord)).toEqual("1234567890");
  });

  it("shouldReturnCorrectPkeyForLegacyPhoneNumberRecord", () => {
    expect(PhoneNumberRecordUtil.getPkey(mockLegacyPhoneNumberRecord)).toEqual("1234567890");
  });

  it("shouldIdentifyDynamicPhoneNumberRecord", () => {
    expect(PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(mockPhoneNumberRecord)).toBe(true);
    expect(PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(mockLegacyPhoneNumberRecord)).toBe(false);
  });

  it("shouldIdentifyLegacyPhoneNumberRecord", () => {
    expect(PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(mockPhoneNumberRecord)).toBe(false);
    expect(PhoneNumberRecordUtil.isLegacyPhoneNumberRecord(mockLegacyPhoneNumberRecord)).toBe(true);
  });

  it("shouldReturnCorrectPropertyValueForDynamicPhoneNumberRecord", () => {
    expect(PhoneNumberRecordUtil.getPropertyValue(mockPhoneNumberRecord, BRAND)).toEqual(BrandTypeEnum.SAFECO);
  });

  it("shouldReturnCorrectPropertyValueForLegacyPhoneNumberRecord", () => {
    expect(PhoneNumberRecordUtil.getPropertyValue(mockLegacyPhoneNumberRecord, GREETING_MESSAGES)).toEqual("Hello");
  });

  it("shouldValidateGreetingMessage", () => {
    expect(PhoneNumberRecordUtil.isValidGreetingMessage("Hello")).toBe(false);
  });

  it("shouldSetPropertyValueForDynamicPhoneNumberRecord", () => {
    PhoneNumberRecordUtil.setPropertyValue(mockPhoneNumberRecord, "brand", "Brand2");
    expect(mockPhoneNumberRecord.brand).toEqual("Brand2");
  });

  it("shouldSetPropertyValueForLegacyPhoneNumberRecord", () => {
    PhoneNumberRecordUtil.setPropertyValue(mockLegacyPhoneNumberRecord, GREETING_MESSAGES, "Hi");
    expect(mockLegacyPhoneNumberRecord.content?.greetingMessages).toEqual("Hi");
  });

  it("shouldRemoveTransientPropertiesForDynamicPhoneNumberRecord", () => {
    const phoneNumberRecordWithTransientProperties = { ...mockPhoneNumberRecord, pkey: "somevalue", id: "someid" };

    expect(phoneNumberRecordWithTransientProperties.pkey).toBeDefined();
    expect(phoneNumberRecordWithTransientProperties.id).toBeDefined();

    PhoneNumberRecordUtil.removeTransientProperties(phoneNumberRecordWithTransientProperties);

    expect(phoneNumberRecordWithTransientProperties.pkey).toBeUndefined();
    expect(phoneNumberRecordWithTransientProperties.id).toBeUndefined();
  });

  it("shouldRemoveTransientPropertiesForLegacyPhoneNumberRecord", () => {
    const phoneNumberRecordWithTransientProperties = { ...mockLegacyPhoneNumberRecord, id: "someid" };

    expect(phoneNumberRecordWithTransientProperties.pkey).toBeDefined();
    expect(phoneNumberRecordWithTransientProperties.id).toBeDefined();

    PhoneNumberRecordUtil.removeTransientProperties(phoneNumberRecordWithTransientProperties);

    expect(phoneNumberRecordWithTransientProperties.pkey).toBeDefined();
    expect(phoneNumberRecordWithTransientProperties.id).toBeUndefined();
  });

  it("shouldReturnTrueForIsDynamicPhoneNumberRecord", () => {
    const phoneNumberRecord = {
      phoneNumber: undefined
    } as PhoneNumber;

    expect(PhoneNumberRecordUtil.isDynamicPhoneNumberRecord(phoneNumberRecord)).toEqual(true);
  });
});