import {
  BOOLEAN_NUMBER_FALSE,
  BOOLEAN_NUMBER_TRUE,
  BOOLEAN_STRING_FALSE,
  BOOLEAN_STRING_TRUE, booleanAsNumber,
  booleanAsString,
  booleanValue,
  isBooleanType, isBooleanValue, isFalse, isNotBooleanType, isNotBooleanValue, isTrue
} from "components/tabs/dynamicCallFlow/common/Util/Boolean.Util";

describe("Boolean.Util", () => {
  describe("isBooleanType", () => {
    it("shouldReturnTrueForBooleanTrue", () => {
      expect(isBooleanType(true)).toBe(true);
    });

    it("shouldReturnTrueForBooleanFalse", () => {
      expect(isBooleanType(false)).toBe(true);
    });

    it("shouldReturnFalseForNonBoolean", () => {
      expect(isBooleanType("true")).toBe(false);
      expect(isBooleanType(1)).toBe(false);
      expect(isBooleanType(null)).toBe(false);
      expect(isBooleanType(undefined)).toBe(false);
    });
  });

  describe("isNotBooleanType", () => {
    it("shouldReturnTrueForNonBooleanValues", () => {
      expect(isNotBooleanType("true")).toBe(true);
      expect(isNotBooleanType(1)).toBe(true);
      expect(isNotBooleanType(null)).toBe(true);
      expect(isNotBooleanType(undefined)).toBe(true);
    });

    it("shouldReturnFalseForBooleanValues", () => {
      expect(isNotBooleanType(true)).toBe(false);
      expect(isNotBooleanType(false)).toBe(false);
    });
  });

  describe("isTrue", () => {
    it("shouldReturnTrueForBooleanTrue", () => {
      expect(isTrue(true)).toBe(true);
    });

    it("shouldReturnFalseForBooleanFalse", () => {
      expect(isTrue(false)).toBe(false);
    });

    it("shouldReturnTrueForStringTrue", () => {
      expect(isTrue("true")).toBe(true);
      expect(isTrue("TRUE")).toBe(true);
    });

    it("shouldReturnFalseForStringFalse", () => {
      expect(isTrue("false")).toBe(false);
      expect(isTrue("FALSE")).toBe(false);
    });

    it("shouldReturnTrueForNumberOne", () => {
      expect(isTrue(1)).toBe(true);
      expect(isTrue("1")).toBe(true);
    });

    it("shouldReturnFalseForNumberZero", () => {
      expect(isTrue(0)).toBe(false);
      expect(isTrue("0")).toBe(false);
    });

    it("shouldReturnFalseForNullAndUndefined", () => {
      expect(isTrue(null)).toBe(false);
      expect(isTrue(undefined)).toBe(false);
    });

    it("shouldReturnFalseForEmptyString", () => {
      expect(isTrue("")).toBe(false);
    });
  });

  describe("isFalse", () => {
    it("shouldReturnTrueForBooleanFalse", () => {
      expect(isFalse(false)).toBe(true);
    });

    it("shouldReturnTrueForStringFalse", () => {
      expect(isFalse("false")).toBe(true);
    });

    it("shouldReturnTrueForNumberZero", () => {
      expect(isFalse(0)).toBe(true);
    });

    it("shouldReturnFalseForBooleanTrue", () => {
      expect(isFalse(true)).toBe(false);
    });

    it("shouldReturnFalseForStringTrue", () => {
      expect(isFalse("true")).toBe(false);
    });

    it("shouldReturnFalseForNumberOne", () => {
      expect(isFalse(1)).toBe(false);
    });

    it("shouldReturnFalseForNonBooleanValues", () => {
      expect(isFalse("yes")).toBe(false);
      expect(isFalse(2)).toBe(false);
      expect(isFalse(null)).toBe(false);
      expect(isFalse(undefined)).toBe(false);
    });
  });

  describe("isBooleanValue", () => {
    it("shouldReturnTrueForBooleanTrue", () => {
      expect(isBooleanValue(true)).toBe(true);
    });

    it("shouldReturnTrueForBooleanFalse", () => {
      expect(isBooleanValue(false)).toBe(true);
    });

    it("shouldReturnTrueForStringTrue", () => {
      expect(isBooleanValue("true")).toBe(true);
    });

    it("shouldReturnTrueForStringFalse", () => {
      expect(isBooleanValue("false")).toBe(true);
    });

    it("shouldReturnTrueForNumberOne", () => {
      expect(isBooleanValue(1)).toBe(true);
    });

    it("shouldReturnTrueForNumberZero", () => {
      expect(isBooleanValue(0)).toBe(true);
    });

    it("shouldReturnFalseForNonBooleanValues", () => {
      expect(isBooleanValue("yes")).toBe(false);
      expect(isBooleanValue(2)).toBe(false);
      expect(isBooleanValue(null)).toBe(false);
      expect(isBooleanValue(undefined)).toBe(false);
    });
  });
  describe("isNotBooleanValue", () => {
    it("shouldReturnFalseForBooleanTrue", () => {
      expect(isNotBooleanValue(true)).toBe(false);
    });

    it("shouldReturnFalseForBooleanFalse", () => {
      expect(isNotBooleanValue(false)).toBe(false);
    });

    it("shouldReturnFalseForStringTrue", () => {
      expect(isNotBooleanValue("true")).toBe(false);
    });

    it("shouldReturnFalseForStringFalse", () => {
      expect(isNotBooleanValue("false")).toBe(false);
    });

    it("shouldReturnFalseForNumberOne", () => {
      expect(isNotBooleanValue(1)).toBe(false);
    });

    it("shouldReturnFalseForNumberZero", () => {
      expect(isNotBooleanValue(0)).toBe(false);
    });

    it("shouldReturnTrueForNonBooleanValues", () => {
      expect(isNotBooleanValue("yes")).toBe(true);
      expect(isNotBooleanValue(2)).toBe(true);
      expect(isNotBooleanValue(null)).toBe(true);
      expect(isNotBooleanValue(undefined)).toBe(true);
    });
  });

  describe("booleanValue", () => {
    it("shouldReturnTrueForStringTrue", () => {
      expect(booleanValue("true")).toBe(true);
    });

    it("shouldReturnTrueForNumberOne", () => {
      expect(booleanValue(1)).toBe(true);
    });

    it("shouldReturnFalseForStringFalse", () => {
      expect(booleanValue("false")).toBe(false);
    });

    it("shouldReturnFalseForNumberZero", () => {
      expect(booleanValue(0)).toBe(false);
    });

    it("shouldReturnFalseForEmptyString", () => {
      expect(booleanValue("")).toBe(false);
    });

    it("shouldReturnFalseForNonBooleanValues", () => {
      expect(booleanValue("yes")).toBe(false);
      expect(booleanValue(2)).toBe(false);
      expect(booleanValue(null)).toBe(false);
      expect(booleanValue(undefined)).toBe(false);
    });
  });

  describe("booleanAsString", () => {
    it("shouldReturnTrueStringForBooleanTrue", () => {
      expect(booleanAsString(true)).toBe(BOOLEAN_STRING_TRUE);
    });

    it("shouldReturnFalseStringForBooleanFalse", () => {
      expect(booleanAsString(false)).toBe(BOOLEAN_STRING_FALSE);
    });

    it("shouldReturnTrueStringForNumberOne", () => {
      expect(booleanAsString(1)).toBe(BOOLEAN_STRING_TRUE);
    });

    it("shouldReturnFalseStringForNumberZero", () => {
      expect(booleanAsString(0)).toBe(BOOLEAN_STRING_FALSE);
    });

    it("shouldReturnTrueStringForNonZeroNumber", () => {
      expect(booleanAsString(42)).toBe(BOOLEAN_STRING_TRUE);
    });

    it("shouldReturnFalseStringForZeroNumber", () => {
      expect(booleanAsString(-1)).toBe(BOOLEAN_STRING_TRUE);
    });
  });

  describe("booleanAsNumber", () => {
    it("shouldReturnOneForBooleanTrue", () => {
      expect(booleanAsNumber(true)).toBe(BOOLEAN_NUMBER_TRUE);
    });

    it("shouldReturnZeroForBooleanFalse", () => {
      expect(booleanAsNumber(false)).toBe(BOOLEAN_NUMBER_FALSE);
    });

    it("shouldReturnOneForStringTrue", () => {
      expect(booleanAsNumber("true")).toBe(BOOLEAN_NUMBER_TRUE);
    });

    it("shouldReturnZeroForStringFalse", () => {
      expect(booleanAsNumber("false")).toBe(BOOLEAN_NUMBER_FALSE);
    });

    it("shouldReturnZeroForEmptyString", () => {
      expect(booleanAsNumber("")).toBe(BOOLEAN_NUMBER_FALSE);
    });

    it("shouldReturnZeroForNonBooleanValues", () => {
      expect(booleanAsNumber("yes")).toBe(BOOLEAN_NUMBER_FALSE);
      expect(booleanAsNumber("no")).toBe(BOOLEAN_NUMBER_FALSE);
    });
  });
});