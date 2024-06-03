// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const { getJestConfigPaths } = require("./pathConfig");

const jestConfig = {
  coveragePathIgnorePatterns: [
    "<rootDir>/__test__",
    "<rootDir>/src/assets",
    "<rootDir>/src/context/appContext.js",
    "<rootDir>/src/globals",
    "<rootDir>/jestSetup.js",
    "/*.Styles.ts",
    "/*.Styles.tsx",
    "/*.Interfaces.ts",
    "/*.Interfaces.tsx",
    "/index.js"
  ],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}"
  ],
  moduleFileExtensions: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "json"
  ],
  moduleNameMapper: {
    // to understand our module paths (ex: files in /src reference other files simply by using 'src/components')
    "^src/(.*)": "<rootDir>/src/$1",
    "^testUtils$": "<rootDir>/__test__/index",
    "\\.(css|less|scss)$": "<rootDir>/__test__/styleMock.js",
    ...getJestConfigPaths()
  },
  setupFilesAfterEnv: ["<rootDir>/jestSetup.js"],
  testMatch: [
    "<rootDir>/src/**/test/**/*.test.js?(x)",
    "<rootDir>/src/**/test/**/*.test.ts?(x)"
  ],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/src/__test__",
    "<rootDir>/src/assets"
  ],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "babel-jest",
    "^.+\\.png$": "jest-raw-loader",
    "^.+\\.svg$": "jest-raw-loader"
  },
  testURL: "http://localhost:8084/",
  verbose: true
};

module.exports = jestConfig;