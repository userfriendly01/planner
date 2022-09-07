// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const jestConfig = {
  coveragePathIgnorePatterns: [
    "<rootDir>/__test__",
    "<rootDir>/src/assets",
    "<rootDir>/src/context/appContext.js",
    "<rootDir>/src/globals",
    "<rootDir>/jestSetup.js",
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
    "^components/(.*)": "<rootDir>/src/components/$1",
    "^components$": "<rootDir>/src/components",
    "^context/(.*)": "<rootDir>/src/context/$1",
    "^context$": "<rootDir>/src/context",
    "^globals$": "<rootDir>/src/globals",
    "^globals/(.*)": "<rootDir>/src/globals/$1",
    "^icons/(.*)": "<rootDir>/src/assets/icons/$1",
    "^services$": "<rootDir>/src/services",
    "^services/(.*)": "<rootDir>/src/services/$1",
    "^testUtils$": "<rootDir>/__test__/index",
    "^utils$": "<rootDir>/src/utils",
    "^utils/(.*)": "<rootDir>/src/utils/$1",
    "\\.(css|less)$": "<rootDir>/__test__/styleMock.js"
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