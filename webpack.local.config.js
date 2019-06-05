const common = require("./webpack.config.js");
const merge = require("webpack-merge");

const localConfig = merge(
  common,
  {
    mode: "development",
    devServer: {
      contentBase: "./dist",
      hot: true,
      port: 8083
    }
  }
);

module.exports = localConfig;
