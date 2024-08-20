import {
  employeeIdIsNotValid,
  employeeIdIsValid, greetingMessageIsNotValid, greetingMessageIsValid, phoneNumberIsNotValid,
  phoneNumberIsValid
} from "dynamicCallFlowCommon/GraphQL/Field.Validation.GraphQL";

describe("Field Validation GraphQL", () => {
  describe("EmployeeId Validation", () => {
    describe("isValid", () => {
      it("shouldReturnTrueForValidEmployeeId", () => {
        expect(employeeIdIsValid("n1234567")).toBe(true);
      });

      it("shouldReturnFalseForEmployeeIdWithoutLeadingN", () => {
        expect(employeeIdIsValid("1234567")).toBe(false);
      });

      it("shouldReturnFalseForEmployeeIdWithMoreThan7Digits", () => {
        expect(employeeIdIsValid("n12345675")).toBe(false);
      });

      it("shouldReturnFalseForEmployeeIdWithLessThan7Digits", () => {
        expect(employeeIdIsValid("n123456")).toBe(false);
      });

      it("shouldReturnFalseForEmptyString", () => {
        expect(employeeIdIsValid("")).toBe(false);
      });

      it("shouldReturnFalseForNonStringInput", () => {
        expect(employeeIdIsValid(123456 as any)).toBe(false);
      });

      it("shouldReturnFalseForUndefined", () => {
        expect(employeeIdIsValid(undefined)).toBe(false);
      });

      it("shouldReturnFalseForNull", () => {
        expect(employeeIdIsValid(null)).toBe(false);
      });
    });

    describe("isNotValid", () => {
      it("shouldReturnFalseForValidEmployeeId", () => {
        expect(employeeIdIsNotValid("n1234567")).toBe(false);
      });

      it("shouldReturnTrueForEmployeeIdWithoutLeadingN", () => {
        expect(employeeIdIsNotValid("1234567")).toBe(true);
      });

      it("shouldReturnTrueForEmployeeIdWithMoreThan7Digits", () => {
        expect(employeeIdIsNotValid("n12345675")).toBe(true);
      });

      it("shouldReturnTrueForEmployeeIdWithLessThan7Digits", () => {
        expect(employeeIdIsNotValid("n123456")).toBe(true);
      });

      it("shouldReturnTrueForEmptyString", () => {
        expect(employeeIdIsNotValid("")).toBe(true);
      });

      it("shouldReturnTrueForNonStringInput", () => {
        expect(employeeIdIsNotValid(123456 as any)).toBe(true);
      });

      it("shouldReturnTrueForUndefined", () => {
        expect(employeeIdIsNotValid(undefined)).toBe(true);
      });

      it("shouldReturnTrueForNull", () => {
        expect(employeeIdIsNotValid(null)).toBe(true);
      });
    });
  });

  describe("Phone Number Validation", () => {
    describe("phoneNumberIsValid", () => {
      it("shouldReturnTrueForValidPhoneNumber", () => {
        const value = "+11234567890";
        expect(phoneNumberIsValid(value)).toBe(true);
      });

      it("shouldReturnFalseForPhoneNumberWithoutPlusSign", () => {
        const value = "11234567890";
        expect(phoneNumberIsValid(value)).toBe(false);
      });

      it("shouldReturnFalseForPhoneNumberWithMoreThan10Digits", () => {
        const value = "+112345678901";
        expect(phoneNumberIsValid(value)).toBe(false);
      });

      it("shouldReturnFalseForPhoneNumberWithLessThan10Digits", () => {
        const value = "+1123456789";
        expect(phoneNumberIsValid(value)).toBe(false);
      });

      it("shouldReturnFalseForEmptyString", () => {
        const value = "";
        expect(phoneNumberIsValid(value)).toBe(false);
      });

      it("shouldReturnFalseForNonStringInput", () => {
        const value = 11234567890;
        expect(phoneNumberIsValid(value as any)).toBe(false);
      });
    });

    describe("phoneNumberIsValid", () => {
      it("shouldReturnFalseForValidPhoneNumber", () => {
        const value = "+11234567890";
        expect(phoneNumberIsNotValid(value)).toBe(false);
      });

      it("shouldReturnTrueForPhoneNumberWithoutPlusSign", () => {
        const value = "11234567890";
        expect(phoneNumberIsNotValid(value)).toBe(true);
      });

      it("shouldReturnTrueForPhoneNumberWithMoreThan10Digits", () => {
        const value = "+112345678901";
        expect(phoneNumberIsNotValid(value)).toBe(true);
      });

      it("shouldReturnTrueForPhoneNumberWithLessThan10Digits", () => {
        const value = "+1123456789";
        expect(phoneNumberIsNotValid(value)).toBe(true);
      });

      it("shouldReturnTrueForEmptyString", () => {
        const value = "";
        expect(phoneNumberIsNotValid(value)).toBe(true);
      });

      it("shouldReturnTrueForNonStringInput", () => {
        const value = 11234567890;
        expect(phoneNumberIsNotValid(value as any)).toBe(true);
      });
    });
  });

  describe("GreetingMessage Validation", () => {
    describe("isValid", () => {
      it("shouldReturnTrueForValidGreetingMessage", () => {
        const value = "Hello, world";
        expect(greetingMessageIsValid(value)).toBe(true);
      });

      it("shouldReturnFalseForGreetingMessageWithInvalidCharacters", () => {
        const value = "Hello, world!@#";
        expect(greetingMessageIsValid(value)).toBe(false);
      });

      it("shouldReturnFalseForEmptyString", () => {
        const value = "";
        expect(greetingMessageIsValid(value)).toBe(false);
      });

      it("shouldReturnFalseForNonStringInput", () => {
        const value = 12345;
        expect(greetingMessageIsValid(value as any)).toBe(false);
      });

      it("shouldReturnTrueForGreetingMessageWithAccentedCharacters", () => {
        const value = "Hola, señor";
        expect(greetingMessageIsValid(value)).toBe(true);
      });
    });

    describe("isNotValid", () => {
      it("shouldReturnFalseForValidGreetingMessage", () => {
        const value = "Hello, world!";
        expect(greetingMessageIsNotValid(value)).toBe(true);
      });

      it("shouldReturnTrueForGreetingMessageWithInvalidCharacters", () => {
        const value = "Hello, world!@#";
        expect(greetingMessageIsNotValid(value)).toBe(true);
      });

      it("shouldReturnTrueForEmptyString", () => {
        const value = "";
        expect(greetingMessageIsNotValid(value)).toBe(true);
      });

      it("shouldReturnTrueForNonStringInput", () => {
        const value = 12345;
        expect(greetingMessageIsNotValid(value as any)).toBe(true);
      });

      it("shouldReturnFalseForGreetingMessageWithAccentedCharacters", () => {
        const value = "Hola, señor";
        expect(greetingMessageIsNotValid(value)).toBe(false);
      });
    });
  });
});