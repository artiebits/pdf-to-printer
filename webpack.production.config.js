const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    libraryTarget: "umd"
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([{ from: "./src/win32/SumatraPDF.exe" }])
  ],
  target: "node",
  node: {
    __dirname: false
  }
};
