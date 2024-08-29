import {
  BrandTypeEnum, CallFlowTypeEnum,
  ChannelTypeEnum,
  PhoneNumberRecordType,
  PhoneNumberTypeEnum
} from "dynamicCallFlowPhoneNumber/GraphQL/Dynamic.PhoneNumber.Interfaces";
import {
  defaultFieldConditionCheck,
  didFieldConditionCheck, drcFieldConditionCheck, dtmfFieldConditionCheck
} from "dynamicCallFlowPhoneNumber/Form/Dynamic.PhoneNumber.Form.FieldConfigs";
import { PhoneNumber } from "google-libphonenumber";

describe("PhoneNumberForm.FieldConfigs", () => {
  describe("Dynamic Phone Number Form Field Configs", () => {
    it("shouldReturnTrueForLibertyMutualSalesDRC", () => {
      const record = {
        phoneNumber: "+18883334444",
        brand: BrandTypeEnum.LIBERTY_MUTUAL,
        channel: ChannelTypeEnum.SALES,
        phoneNumberType: PhoneNumberTypeEnum.DRC
      } as unknown as PhoneNumber;
      expect(drcFieldConditionCheck(record)).toBe(true);
    });

    it("shouldReturnFalseForNonLibertyMutualBrand", () => {
      const record = {
        phoneNumber: "+18883334444",
        brand: BrandTypeEnum.SAFECO,
        channel: ChannelTypeEnum.SALES,
        phoneNumberType: PhoneNumberTypeEnum.DRC
      } as unknown as PhoneNumber;
      expect(drcFieldConditionCheck(record)).toBe(false);
    });

    it("shouldReturnFalseForNonSalesChannel", () => {
      const record = {
        phoneNumber: "+18883334444",
        brand: BrandTypeEnum.LIBERTY_MUTUAL,
        channel: ChannelTypeEnum.CLAIMS,
        phoneNumberType: PhoneNumberTypeEnum.DRC
      } as unknown as PhoneNumber;
      expect(drcFieldConditionCheck(record)).toBe(false);
    });

    it("shouldReturnFalseForNonDRCType", () => {
      const record = {
        phoneNumber: "+18883334444",
        brand: BrandTypeEnum.LIBERTY_MUTUAL,
        channel: ChannelTypeEnum.SALES,
        phoneNumberType: PhoneNumberTypeEnum.DID
      } as unknown as PhoneNumber;
      expect(drcFieldConditionCheck(record)).toBe(false);
    });

    it("shouldReturnTrueForDIDType", () => {
      const record = {
        phoneNumber: "+18883334444",
        phoneNumberType: PhoneNumberTypeEnum.DID
      } as unknown as PhoneNumber;
      expect(didFieldConditionCheck(record)).toBe(true);
    });

    it("shouldReturnFalseForNonDIDType", () => {
      const record = {
        phoneNumber: "+18883334444",
        phoneNumberType: PhoneNumberTypeEnum.DRC
      } as unknown as PhoneNumber;
      expect(didFieldConditionCheck(record)).toBe(false);
    });

    it("shouldReturnTrueForDTMFType", () => {
      const record = {
        phoneNumber: "+18883334444",
        callFlowType: CallFlowTypeEnum.DTMF
      } as unknown as PhoneNumber;
      expect(dtmfFieldConditionCheck(record)).toBe(true);
    });

    it("shouldReturnFalseForNonDTMFType", () => {
      const record = {
        phoneNumber: "+18883334444",
        callFlowType: CallFlowTypeEnum.SELFSERVICE
      } as unknown as PhoneNumber;
      expect(dtmfFieldConditionCheck(record)).toBe(false);
    });
  });

  describe("Legacy Phone Number Form Field Configs", () => {
    it("should return true for LibertyMutual Sales DRC", () => {
      const record = {
        brand: BrandTypeEnum.LIBERTY_MUTUAL,
        channel: ChannelTypeEnum.SALES,
        type: PhoneNumberTypeEnum.DRC
      } as PhoneNumberRecordType;
      expect(drcFieldConditionCheck(record)).toBe(true);
    });

    it("shouldReturnFalseForNonLibertyMutualBrand", () => {
      const record = {
        brand: BrandTypeEnum.SAFECO,
        channel: ChannelTypeEnum.SALES,
        type: PhoneNumberTypeEnum.DRC
      } as PhoneNumberRecordType;
      expect(drcFieldConditionCheck(record)).toBe(false);
    });

    it("shouldReturnFalseForNonSalesChannel", () => {
      const record = {
        brand: BrandTypeEnum.LIBERTY_MUTUAL,
        channel: ChannelTypeEnum.CLAIMS,
        type: PhoneNumberTypeEnum.DRC
      } as PhoneNumberRecordType;
      expect(drcFieldConditionCheck(record)).toBe(false);
    });

    it("shouldReturnFalseForNonDRCType", () => {
      const record = {
        brand: BrandTypeEnum.LIBERTY_MUTUAL,
        channel: ChannelTypeEnum.SALES,
        type: PhoneNumberTypeEnum.DID
      } as PhoneNumberRecordType;
      expect(drcFieldConditionCheck(record)).toBe(false);
    });

    it("should return true for DIDType", () => {
      const record = {
        type: PhoneNumberTypeEnum.DID
      } as PhoneNumberRecordType;
      expect(didFieldConditionCheck(record)).toBe(true);
    });

    it("shouldReturnFalseForNonDIDType", () => {
      const record = {
        type: PhoneNumberTypeEnum.DRC
      } as PhoneNumberRecordType;
      expect(didFieldConditionCheck(record)).toBe(false);
    });

    it("should always return true for defaultFieldConditionCheck", () => {
      expect(defaultFieldConditionCheck({} as PhoneNumberRecordType)).toBe(true);
    });
  });
});