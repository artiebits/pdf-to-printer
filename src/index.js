"use strict";

const os = require("os");

function throwNotSupportedError() {
  throw new Error("Platform not supported");
}

switch (os.platform()) {
  case "darwin":
  case "linux":
    module.exports = {
      print: require("./unix/print"),
      list: require("./unix/printers")
    };
    break;
  case "win32":
    module.exports = {
      print: require("./win32/print"),
      list: require("./win32/printers")
    };
    break;
  default:
    throwNotSupportedError();
}
