import {
  cleanupField,
  formatErrorMessage,
  toProperCase
} from "../../BulkUtils";

describe("formatErrorMessage", () => {
  test("err?.response?.data?.message", () => {
    const error = {
      response: {
        data: {
          message: "WOOHOO"
        }
      }
    };
    const result = formatErrorMessage(error);
    expect(result).toBe("WOOHOO");
  });
  test("err?.response?.data?.errors", () => {
    const error = {
      response: {
        data: {
          errors: ["WOOHOO", "BOOHOO"]
        }
      }
    };
    const result = formatErrorMessage(error);
    expect(result).toBe("WOOHOO,BOOHOO");
  });
  test("err?.response?.message", () => {
    const error = {
      response: {
        message: "WOOHOO"
      }
    };
    const result = formatErrorMessage(error);
    expect(result).toBe("WOOHOO");
  });
  test("err.toString();", () => {
    const result = formatErrorMessage(new Error("Hmmm"));
    expect(result).toBe("Error: Hmmm");
  });
  test("err", () => {
    const result = formatErrorMessage(null);
    expect(result).toBe(null);
  });
});

describe("toProperCase", () => {
  test("should return proper case", () => {
    const result = toProperCase("oH my WOrd");
    expect(result).toBe("Oh My Word");
  });
});

describe("cleanupField", () => {
  describe("requires string", () => {
    test("string is passed", () => {
      const result = cleanupField("Snowball Jones  ", "string");
      expect(result).toBe("snowball jones");
    });
    test("non string is passed", () => {
      const result = cleanupField(["snow?", "jones"], "string");
      expect(result).toBe("snow?,jones");
    });
  });
  describe("requires number", () => {
    test("number is passed", () => {
      const result = cleanupField(3, "number");
      expect(result).toBe(3);
    });
    test("parsable non number is passed", () => {
      const result = cleanupField("3", "number");
      expect(result).toBe(3);
    });
    test("non parsable string is passed", () => {
      const result = cleanupField("44hsj", "number");
      expect(result).toBe("44hsj");
    });
  });
  describe("requires other", () => {
    const result = cleanupField("oH my WOrd", "boolean");
    expect(result).toBe("oH my WOrd");
  });
  describe("field is null", () => {
    const result = cleanupField(null, "boolean");
    expect(result).toBe(null);
  });
});