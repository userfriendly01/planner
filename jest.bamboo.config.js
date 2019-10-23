const commonConfig = require("./jest.config");
const merge = require("webpack-merge");

const bambooConfig = {
  "testResultsProcessor": "jest-bamboo-reporter"
};

const config = merge(bambooConfig, commonConfig);
module.exports = config;