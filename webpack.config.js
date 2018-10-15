const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  devServer: {
    contentBase: "./dist",
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  }
};
