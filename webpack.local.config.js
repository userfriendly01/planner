const common = require("./webpack.config.js");
const { merge } = require("webpack-merge");
const path = require("path");

const localConfig = merge(
  common,
  {
    mode: "development",
    devServer: {
      static: {
        directory: path.join(__dirname, "dist")
      },
      hot: true,
      port: 8084,
      historyApiFallback: true
    }
  }
);

module.exports = localConfig;
