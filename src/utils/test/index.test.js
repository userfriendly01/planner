import {
  escapeQuotes, isErrorIn400s, wait
} from "../index";

jest.useFakeTimers();

describe("escapeQuotes", () => {
  test("should escape single and double quotes", () => {
    const unescapedString = "I'm \"a\" sentence";
    const result = escapeQuotes(unescapedString);
    expect(result).toBe("I\\'m \\\"a\\\" sentence");
  });
});

describe("wait", () => {
  const callback = jest.fn();
  const waitTime = 1000;
  test("should wait 1 second before calling the callback", () => {
    wait(callback, waitTime);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(callback, waitTime);
  });
});

describe("isErrorIn400s", () => {
  describe("error status code is in 400's", () => {
    test("should return true", () => {
      expect(isErrorIn400s(403)).toBe(true);
    });
  });
  describe("error status code is not in the 400's", () => {
    const testNotIn400s = statusCode => {
      test("should return false", () => {
        expect(isErrorIn400s(statusCode)).toBe(false);
      });
    };
    describe("error status code is in 300's", () => {
      testNotIn400s(301);
    });
    describe("error status code starts with 4 but is less than 3 digits", () => {
      testNotIn400s(41);
    });
    describe("error status code starts with 4 but is more than 3 digits", () => {
      testNotIn400s(4321);
    });
    describe("error status code is a string not a number", () => {
      testNotIn400s("401");
    });
    describe("error status code is undefined", () => {
      testNotIn400s(undefined);
    });
  });
});
