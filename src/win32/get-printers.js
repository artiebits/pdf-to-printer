"use strict";

const execFileAsync = require("../utils/exec-file-async");

const getPrinters = () => {
  const stdoutHandler = (stdout) => {
    const printers = [];

    stdout
      .split(/(\r?\n){2,}/)
      .map((printer) => printer.trim())
      .filter((printer) => !!printer)
      .forEach((printer) => {
        const printerData = {
          deviceId: null,
          name: null,
        };

        printer.split(/\r?\n/).some((line) => {
          const [label, value] = line.split(":").map((el) => el.trim());

          const lowerLabel = label.toLowerCase();

          if (lowerLabel === "deviceid") printerData.deviceId = value;

          if (lowerLabel === "name") printerData.name = value;

          if (printerData.deviceId && printerData.name) return true;

          return false;
        });

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
