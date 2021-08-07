"use strict";

const execFileAsync = require("../utils/exec-file-async");
const isValidPrinter = require("../utils/windows-printer-valid");

const getDefaultPrinter = () => {
  const stdoutHandler = (stdout) => {
    const printer = stdout.trim();

    // If stdout is empty, there is no default printer
    if (!stdout) return null;

    const { isValid, printerData } = isValidPrinter(printer);

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
