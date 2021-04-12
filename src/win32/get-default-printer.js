"use strict";

const execAsync = require("../execAsync");

const getDefaultPrinter = () => {
  const stdoutHandler = (stdout) => {
    const result = stdout
      .trim()
      .split(/[\r\n]+/)
      .map((line) => line.trim().split(/\s{2,}/));

    const headers = result[0].reduce((acc, curr, index) => {
      acc[curr] = index;
      return acc;
    }, {});

    const defaultPrinter = result
      .slice(1)
      .find((printerData) => printerData[headers["Default"]] === "TRUE");

    if (!defaultPrinter) return false;

    return {
      deviceId: defaultPrinter[headers["DeviceID"]],
      name: defaultPrinter[headers["Name"]],
    };
  };

  // https://ss64.com/nt/wmic.html#alias_options
  return execAsync(
    "wmic",
    ["printer", "get", "default,deviceid,name"],
    stdoutHandler
  );
};

module.exports = getDefaultPrinter;
