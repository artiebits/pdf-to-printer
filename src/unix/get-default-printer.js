"use strict";

const execAsync = require("../utils/exec-async");

async function getDefaultPrinter() {
  try {
    const { stdout } = await execAsync("lpstat -d");
    const printer = parsePrinterId(stdout);
    return printer ? getPrinterDetails(printer) : null;
  } catch (error) {
    throw error;
  }
}

function parsePrinterDescription(stdout) {
  return stdout
    .split("\n")
    .slice(1)
    .find((line) => line.indexOf("Description") !== -1)
    .split(":")[1]
    .trim();
}

function parsePrinterId(output) {
  const startIndex = output.indexOf(":");
  if (startIndex === -1) return null;
  return output.substr(startIndex + 1).trim();
}

async function getPrinterDetails(printer) {
  const { stdout } = await execAsync(`lpstat -lp ${printer}`);
  const description = parsePrinterDescription(stdout);
  return {
    deviceId: printer,
    name: description,
  };
}

module.exports = getDefaultPrinter;
