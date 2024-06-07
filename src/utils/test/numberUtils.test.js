import {
  formatE164PhoneNumber,
  formatTenDigitNumber,
  removeNonNumericCharacters
} from "../numberUtils";

describe("formatTenDigitNumber", () => {
  const testUnchanged = num => {
    test("should not change the number", () => {
      expect(formatTenDigitNumber(num)).toBe(num);
    });
  };

  describe("strings", () => {
    describe("ten-digits", () => {
      test("should format with parentheses & dash", () => {
        expect(formatTenDigitNumber("8006537893")).toBe("(800) 653-7893");
      });
    });
    describe("nine-digits", () => {
      testUnchanged("123456789");
    });
    describe("2-digits", () => {
      testUnchanged("12");
    });
    describe("empty string", () => {
      testUnchanged("");
    });
  });

  describe("numbers (not strings)", () => {
    describe("ten-digits", () => {
      test("should format with parentheses & dash", () => {
        expect(formatTenDigitNumber(1234567890)).toBe("(123) 456-7890");
      });
    });
    describe("five digits", () => {
      test("should return number as a string", () => {
        expect(formatTenDigitNumber(12345)).toBe("12345");
      });
    });
  });
});

describe("removeNonNumericCharacters", () => {
  test("should return string with non-numeric characters removed", () => {
    expect(removeNonNumericCharacters("ab-c12(3g4)5p")).toBe("12345");
  });
});

describe("formatE164PhoneNumber", () => {
  const expectedPhoneNumber = "8005556666";
  test("should replace +1 with empty string", () => {
    expect(formatE164PhoneNumber("+18005556666")).toEqual(expectedPhoneNumber);
  });
  test("should replace 1 with empty string", () => {
    expect(formatE164PhoneNumber("18005556666")).toEqual(expectedPhoneNumber);
  });
});
