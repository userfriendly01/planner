import { formatTenDigitNumber } from "../formatTenDigitNumber";

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
