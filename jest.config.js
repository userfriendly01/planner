// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

const jestConfig = {
  coveragePathIgnorePatterns: [
    "<rootDir>/__test__",
    "<rootDir>/src/assets",
    "<rootDir>/src/consts",
    "<rootDir>/jestSetup.js",
    "/index.js"
  ],
  collectCoverageFrom: [
    "src/**/*.{js,jsx}"
  ],
  moduleFileExtensions: [
    "js",
    "jsx",
    "json"
  ],
  moduleNameMapper: {
    // to understand our module paths (ex: files in /src reference other files simply by using 'src/components')
    // "\\.(css|less|scss)$": "<rootDir>/src/__test__/__mocks__/fileMock.js",
    "^src/(.*)": "<rootDir>/src/$1",
    "^components/(.*)": "<rootDir>/src/components/$1",
    "^components$": "<rootDir>/src/components",
    "^globals$": "<rootDir>/src/globals",
    "^globals/(.*)": "<rootDir>/src/globals/$1",
    "^icons/(.*)": "<rootDir>/src/assets/icons/$1",
    "^testUtils$": "<rootDir>/__test__/index",
    "^utils$": "<rootDir>/src/utils",
    "^utils/(.*)": "<rootDir>/src/utils/$1"
  },
  setupFilesAfterEnv: ["<rootDir>/jestSetup.js"],
  testMatch: [
    "<rootDir>/src/**/test/**/*.test.js?(x)"
  ],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/src/__test__",
    "<rootDir>/src/assets"
  ],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.png$": "jest-raw-loader",
    "^.+\\.svg$": "jest-raw-loader"
  },
  testURL: "http://localhost:8084/",
  verbose: true
};

module.exports = jestConfig;