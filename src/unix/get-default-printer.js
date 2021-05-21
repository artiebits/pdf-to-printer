"use strict";

const execAsync = require("../utils/exec-async");

const getDefaultPrinterDeviceId = (output) => {
  const startIndex = output.indexOf(":");
  if (startIndex == -1) return false;

  return output.substr(startIndex + 1).trim();
};

const parseDefaultPrinterData = (output) => ({
  deviceId: output.split(" ")[1],
  name: output
    .split("\n")
    .slice(1)
    .find((line) => line.indexOf("Description") !== -1)
    .split(":")[1]
    .trim(),
});

const getDefaultPrinter = () => {
  const parseResult = (output) => {
    let defaultPrinterDeviceId = getDefaultPrinterDeviceId(output);

    if (!defaultPrinterDeviceId) return false;

    return execAsync(
      `lpstat -lp ${defaultPrinterDeviceId}`,
      parseDefaultPrinterData
    );
  };

  return execAsync("lpstat -d", parseResult);
};

module.exports = getDefaultPrinter;
