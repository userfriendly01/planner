const path = require("path");

const resolvePathInSrc = resourceInSrc => {
  return resourceInSrc
    ? path.resolve(__dirname, "src", resourceInSrc)
    : path.resolve(__dirname, "src");
};

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const config = {
  entry: {
    app: "./src/index.js"
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "template.html"
    })
  ],
  output: {
    filename: "admin-ui.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // js and jsx
        exclude: /node_modules/,
        query: {
          presets: ["@babel/react"]
        },
        loader: "babel-loader"
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          failOnWarning: true
        }
      }
    ]
  },
  resolve: {
    alias: {
      // You will need to define similar aliases in jest.config.js
      src: resolvePathInSrc(),
      components: resolvePathInSrc("components")
    },
    extensions: [ ".js", ".jsx" ],
    mainFiles: [ "index" ]
  }
};

module.exports = config;
