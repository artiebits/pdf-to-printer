"use strict";

const os = require("os");

if (os.platform() !== "win32") {
  throw new Error("Platform not supported");
}

module.exports = {
  print: require("./print"),
  getPrinters: require("./get-printers"),
  getDefaultPrinter: require("./get-default-printer"),
};
