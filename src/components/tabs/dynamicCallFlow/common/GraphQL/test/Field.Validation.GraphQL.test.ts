import {
  phoneNumberIsNotValid, phoneNumberIsValid
} from "dynamicCallFlowCommon/GraphQL/Field.Validation.GraphQL";


describe("Phone Number Validation", () => {
  describe("phoneNumberIsValid", () => {
    it("shouldReturnTrueForValidPhoneNumber", () => {
      const value = "+12345678901";
      expect(phoneNumberIsValid(value)).toBe(true);
    });

    it("shouldReturnFalseForPhoneNumberWithoutPlusSign", () => {
      const value = "12345678901";
      expect(phoneNumberIsValid(value)).toBe(false);
    });

    it("shouldReturnFalseForPhoneNumberWithMoreThan11Digits", () => {
      const value = "+123456789012";
      expect(phoneNumberIsValid(value)).toBe(false);
    });

    it("shouldReturnFalseForPhoneNumberWithLessThan11Digits", () => {
      const value = "+1234567890";
      expect(phoneNumberIsValid(value)).toBe(false);
    });

    it("shouldReturnFalseForEmptyString", () => {
      const value = "";
      expect(phoneNumberIsValid(value)).toBe(false);
    });

    it("shouldReturnFalseForNonStringInput", () => {
      const value = 12345678901;
      expect(phoneNumberIsValid(value as any)).toBe(false);
    });
  });

  describe("phoneNumberIsNotValid", () => {
    it("shouldReturnFalseForValidPhoneNumber", () => {
      const value = "+12345678901";
      expect(phoneNumberIsNotValid(value)).toBe(false);
    });

    it("shouldReturnTrueForPhoneNumberWithoutPlusSign", () => {
      const value = "12345678901";
      expect(phoneNumberIsNotValid(value)).toBe(true);
    });

    it("shouldReturnTrueForPhoneNumberWithMoreThan11Digits", () => {
      const value = "+123456789012";
      expect(phoneNumberIsNotValid(value)).toBe(true);
    });

    it("shouldReturnTrueForPhoneNumberWithLessThan11Digits", () => {
      const value = "+1234567890";
      expect(phoneNumberIsNotValid(value)).toBe(true);
    });

    it("shouldReturnTrueForEmptyString", () => {
      const value = "";
      expect(phoneNumberIsNotValid(value)).toBe(true);
    });

    it("shouldReturnTrueForNonStringInput", () => {
      const value = 12345678901;
      expect(phoneNumberIsNotValid(value as any)).toBe(true);
    });
  });
});