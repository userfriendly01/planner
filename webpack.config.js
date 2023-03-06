const { DefinePlugin } = require("webpack");
const ESLintPlugin = require("eslint-webpack-plugin");
const path = require("path");

const resolvePathInSrc = resourceInSrc => {
  return resourceInSrc
    ? path.resolve(__dirname, "src", resourceInSrc)
    : path.resolve(__dirname, "src");
};

const config = {
  entry: resolvePathInSrc("index"),
  output: {
    filename: "admin-ui.js",
    path: path.resolve(__dirname, "dist")
    // publicPath: "/triton-admin/"
  },
  plugins: [
    new DefinePlugin({
      // Only for running the app locally
      // Environment variables are injected into bamboo builds at deploy time from deployment/manifest-*.yml
      "process.env.APP_ENV": JSON.stringify(process.env.APP_ENV)
    }),
    new ESLintPlugin({ failOnWarning: true })
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
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
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
    extensions: [ ".js", ".jsx", ".ts", ".tsx" ],
    mainFiles: [ "index" ]
  }
};

module.exports = config;
