const common = require("./webpack.config.js");
const merge = require("webpack-merge");

module.exports = merge(
  common,
  {
    mode: "development",
    devServer: {
      contentBase: "./dist",
      hot: true
    }
  }
);
