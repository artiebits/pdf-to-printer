"use strict";

const execAsync = require("../execAsync");

const getPrinters = () => {
  const stdoutHandler = (stdout) => {
    const result = stdout
      .trim()
      .split(/[\r\n]+/)
      .map((line) => line.trim().split(/\s{2,}/));
    const headers = result[0].reduce((acc, curr, index) => {
      acc[curr] = index;
      return acc;
    }, {});
    return result.slice(1).map((printerData) => ({
      name: printerData[headers["DeviceID"]],
      displayName: printerData[headers["Name"]],
    }));
  };
  // https://ss64.com/nt/wmic.html#alias_options
  return execAsync("wmic", ["printer", "get", "deviceid,name"], stdoutHandler);
};

module.exports = getPrinters;
