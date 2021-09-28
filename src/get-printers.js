"use strict";

const execFileAsync = require("./utils/exec-file-async");
const isValidPrinter = require("./utils/windows-printer-valid");

async function getPrinters() {
  function stdoutHandler(stdout) {
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
  }

  try {
    const { stdout } = await execFileAsync("Powershell.exe", [
      "-Command",
      "Get-CimInstance Win32_Printer -Property DeviceID,Name",
    ]);
    return stdoutHandler(stdout);
  } catch (error) {
    throw error;
  }
}

module.exports = getPrinters;
