"use strict";

const os = require("os");

function throwNotSupportedError() {
  throw new Error("Platform not supported");
}

switch (os.platform()) {
  case "darwin":
  case "linux":
    console.warn(
      "Pdf-to-printer will stop supporting Unix-like operating systems by the end of October 2021. Make sure you migrated to unix-print package https://github.com/artiebits/unix-print"
    );
    module.exports = {
      print: require("./unix/print"),
      getPrinters: require("./unix/get-printers"),
      getDefaultPrinter: require("./unix/get-default-printer"),
      observe: require("./unix/observe"),
      cancel: require("./unix/cancel"),
    };
    break;
  case "win32":
    module.exports = {
      print: require("./win32/print"),
      getPrinters: require("./win32/get-printers"),
      getDefaultPrinter: require("./win32/get-default-printer"),
      observe: require("./win32/observe"),
      cancel: require("./win32/cancel"),
    };
    break;
  default:
    throwNotSupportedError();
}
