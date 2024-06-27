import {
  cleanupField,
  formatErrorMessage,
  toProperCase,
  formatDateFromExcelDate
} from "../_formatUtils";

describe("formatErrorMessage", () => {
  test("err?.response?.data", () => {
    const error = {
      response: {
        data: {
          message: "WOOHOO",
          errors: ["WOOHOO", "BOOHOO"]
        }
      }
    };
    const result = formatErrorMessage(error);
    expect(result).toBe(JSON.stringify(error.response.data));
  });
  test("err?.response", () => {
    const error = {
      response: {
        other: "information"
      }
    };
    const result = formatErrorMessage(error);
    expect(result).toStrictEqual(JSON.stringify(error.response));
  });
  test("err?.message;", () => {
    const result = formatErrorMessage(new Error("Hmmm"));
    expect(result).toBe("Hmmm");
  });
  test("err", () => {
    const result = formatErrorMessage(null);
    expect(result).toBe("null");
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

describe("formatDateFromExcelDate", () => {
  test("excelDate is a string word, throws error", () => {
    try {
      formatDateFromExcelDate("boo");
    } catch (e) {
      expect(e).toEqual(new Error("Invalid date"));
    }
  });
  test("date is a string date, throws error", () => {
    try {
      formatDateFromExcelDate("3/24/2023");
    } catch (e) {
      expect(e).toEqual(new Error("Invalid date"));
    }
  });
  test("excelDate is correct format, day and month are single digits, returns date in correct YYYY-MM-DD format", () => {
    const result = formatDateFromExcelDate(39448);
    expect(result).toEqual("2008-01-01");
  });
  test("excelDate is correct format, day and month are double digits, returns date in correct YYYY-MM-DD format", () => {
    const result = formatDateFromExcelDate(40837);
    expect(result).toEqual("2011-10-21");
  });
});