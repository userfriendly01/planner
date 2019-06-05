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
    "^src/(.*)": "<rootDir>/src/$1",
    "^components/(.*)": "<rootDir>/src/components/$1",
    "^components$": "<rootDir>/src/components"
  },
  setupFilesAfterEnv: ["<rootDir>/jestSetup.js"],
  testMatch: [
    "<rootDir>/src/**/test/**/*.test.js?(x)"
  ],
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  testURL: "http://localhost:8083/",
  verbose: true
};

module.exports = jestConfig;