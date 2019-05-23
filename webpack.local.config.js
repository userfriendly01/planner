const common = require("./webpack.config.js");
const merge = require("webpack-merge");

module.exports = merge(
  common,
  {
    mode: "development",
    devServer: {
      compress: true,
      contentBase: "./dist",
      hot: true,
      port: 8082
    }
  }
);
