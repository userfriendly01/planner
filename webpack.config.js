/* eslint-disable no-undef */
const ESLintPlugin = require("eslint-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const webpack = require("webpack");
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
  },
  plugins: [
    new ESLintPlugin({ failOnWarning: true }),
    new webpack.ProvidePlugin({
      process: "process/browser.js",
      Buffer: ["buffer", "Buffer"]
    }),
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: "static",
      reportFilename: "report.html"
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
          "css-loader"
        ]
      }
    ]
  },
  resolve: {
    alias: {
      // You will need to define similar aliases in jest.config.js
      src: resolvePathInSrc(),
      authentication: resolvePathInSrc("authentication"),
      components: [resolvePathInSrc("components")],
      alohaFlow: resolvePathInSrc("components/tabs/alohaFlow"),
      alohaRouting: resolvePathInSrc("components/tabs/alohaRouting"),
      callflowmanagement: resolvePathInSrc("components/tabs/callflowmanagement"),
      dynamicFlow: resolvePathInSrc("components/tabs/dynamicFlow"),
      orgmanagement: resolvePathInSrc("components/tabs/orgmanagement"),
      usermanagement: resolvePathInSrc("components/tabs/usermanagement"),
      context: resolvePathInSrc("context"),
      globals: resolvePathInSrc("globals"),
      icons: resolvePathInSrc("assets/icons"),
      services: resolvePathInSrc("services"),
      utils: resolvePathInSrc("utils"),
      // "styled-components": path.resolve(__dirname, "node_modules", "styled-components"),
      process: "process/browser.js"
    },
    fallback: {
      zlib: require.resolve("browserify-zlib"),
      util: require.resolve("util/"),
      assert: require.resolve("assert"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer/")
    },
    extensions: [ ".js", ".jsx", ".ts", ".tsx",".scss" ],
    mainFiles: [ "index" ]
  }
};

module.exports = config;
