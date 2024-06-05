import {
  getConfigPaths,
  getWebpackPaths,
  getJestConfigPaths
} from "../../../pathConfig";
const path = require("path");

const resolvePathInSrc = resourceInSrc => {
  return resourceInSrc
    ? path.resolve(__dirname, "src", resourceInSrc)
    : path.resolve(__dirname, "src");
};

describe("", () => {
  test("", () => {
    expect(getConfigPaths()).toBe("butts");
  });
});