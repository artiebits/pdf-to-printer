"use strict";

const execFileAsync = require("./utils/exec-file-async");
const isValidPrinter = require("./utils/windows-printer-valid");

async function getDefaultPrinter() {
  try {
    const { stdout } = await execFileAsync("Powershell.exe", [
      "-Command",
      "Get-CimInstance Win32_Printer -Property DeviceID,Name -Filter Default=true",
    ]);

    const printer = stdout.trim();

    // If stdout is empty, there is no default printer
    if (!stdout) return null;

    const { isValid, printerData } = isValidPrinter(printer);

    // DeviceID or Name not found
    if (!isValid) return null;

    return printerData;
  } catch (error) {
    throw error;
  }
}

module.exports = getDefaultPrinter;
