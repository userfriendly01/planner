const ESLintPlugin = require("eslint-webpack-plugin");
const { DefinePlugin } = require("webpack");
const path = require("path");

const resolvePathInSrc = resourceInSrc => {
  return resourceInSrc
    ? path.resolve(__dirname, "src", resourceInSrc)
    : path.resolve(__dirname, "src");
};

console.log(process.env);

const config = {
  entry: resolvePathInSrc("index"),
  output: {
    filename: "admin-ui.js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new ESLintPlugin({ failOnWarning: true }),
    new DefinePlugin({
      "process.env": {
        APP_ENV: JSON.stringify(process.env.APP_ENV) || JSON.stringify("local"),
        DATADOG_APPLICATION_ID: JSON.stringify(process.env.DATADOG_APPLICATION_ID) || JSON.stringify("youNeedToSetThisLocally"),
        DATADOG_CLIENT_TOKEN: JSON.stringify(process.env.DATADOG_CLIENT_TOKEN) || JSON.stringify("youNeedToSetThisLocally"),
        TROUX_ID: JSON.stringify(process.env.TROUX_ID) || JSON.stringify("00000000-0000-0000-0000-000000000000")
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [{
          loader: "url-loader",
          options: {
            limit: 8192 // Convert images < 8KB to base64 strings
          }
        }]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  resolve: {
    alias: {
      // You will need to define similar aliases in jest.config.js
      src: resolvePathInSrc(),
      authentication: resolvePathInSrc("authentication"),
      components: resolvePathInSrc("components"),
      context: resolvePathInSrc("context"),
      globals: resolvePathInSrc("globals"),
      icons: resolvePathInSrc("assets/icons"),
      services: resolvePathInSrc("services"),
      utils: resolvePathInSrc("utils")
    },
    extensions: [ ".js", ".jsx", ".ts", ".tsx",".scss" ],
    mainFiles: [ "index" ]
  }
};

module.exports = config;
