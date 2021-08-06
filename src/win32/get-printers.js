"use strict";

const execFileAsync = require("../utils/exec-file-async");
const isValidPrinter = require("../utils/windows-printer-valid");

const getPrinters = () => {
  const stdoutHandler = (stdout) => {
    const printers = [];

    stdout
      .split(/(\r?\n){2,}/)
      .map((printer) => printer.trim())
      .filter((printer) => !!printer)
      .forEach((printer) => {
        const { isValid, printerData } = isValidPrinter(printer);

        if (!isValid) return;

        printers.push(printerData);
      });

    return printers;
  };

  return execFileAsync(
    "Powershell.exe",
    ["-Command", "Get-CimInstance Win32_Printer -Property DeviceID,Name"],
    stdoutHandler
  );
};

module.exports = getPrinters;
