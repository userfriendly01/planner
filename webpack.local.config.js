const common = require("./webpack.config.js");
const merge = require("webpack-merge");

const localConfig = merge(
  common,
  {
    mode: "development",
    devServer: {
      contentBase: "./dist",
      hot: true,
      port: 8084,
      historyApiFallback: true
    }
  }
);

module.exports = localConfig;
