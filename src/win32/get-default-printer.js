"use strict";

const execFileAsync = require("../utils/exec-file-async");

const getDefaultPrinter = () => {
  const stdoutHandler = (stdout) => {
    stdout = stdout.trim();

    // If stdout is empty, there is no default printer
    if (!stdout) return null;

    const printerData = {
      deviceId: null,
      name: null,
    };

    const isValid = stdout.split(/\r?\n/).some((line) => {
      const [label, value] = line.split(":").map((el) => el.trim());

      const lowerLabel = label.toLowerCase();

      if (lowerLabel === "deviceid") printerData.deviceId = value;

      if (lowerLabel === "name") printerData.name = value;

      if (printerData.deviceId && printerData.name) return true;

      return false;
    });

    // DeviceID or Name not found
    if (!isValid) return null;

    return printerData;
  };

  return execFileAsync(
    "Powershell.exe",
    [
      "-Command",
      "Get-CimInstance Win32_Printer -Property DeviceID,Name -Filter Default=true",
    ],
    stdoutHandler
  );
};

module.exports = getDefaultPrinter;
