const common = require("./webpack.config.js");
const merge = require("webpack-merge");
const { DefinePlugin } = require("webpack");

const localConfig = merge(
  common,
  {
    mode: "development",
    devServer: {
      contentBase: "./dist",
      hot: true,
      port: 8084,
      historyApiFallback: true
    },
    plugins: [
      new DefinePlugin({
        "process.env.APP_ENV": JSON.stringify("local"),
        "process.env.TROUX_ID": JSON.stringify("youNeedToSetThisLocally"),
        "process.env.DATADOG_APPLICATION_ID": JSON.stringify("youNeedToSetThisLocally"),
        "process.env.DATADOG_CLIENT_TOKEN": JSON.stringify("youNeedToSetThisLocally")
      })
    ]
  }
);

module.exports = localConfig;
