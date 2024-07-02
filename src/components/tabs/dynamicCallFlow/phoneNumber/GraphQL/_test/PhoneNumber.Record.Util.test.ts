import { PhoneNumberRecordUtil } from "../PhoneNumber.Record.Util";
import {
  PhoneNumber, BrandTypeEnum
} from "../Dynamic.PhoneNumber.Interfaces";
import { CctSharedCallFlowDb } from "../Legacy.PhoneNumber.Interfaces";
import { BRAND, GREETING_MESSAGES } from "dynamicCallFlow/Form/Dynamic.PhoneNumber.Form.Fields";

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
});