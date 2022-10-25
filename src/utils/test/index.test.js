import { escapeQuotes } from "../index";

describe("escapeQuotes", () => {
  test("should escape single and double quotes", () => {
    const unescapedString = "I'm \"a\" sentence";
    const result = escapeQuotes(unescapedString);
    expect(result).toBe("I\\'m \\\"a\\\" sentence");
  });
});