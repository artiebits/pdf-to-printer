"use strict";

const execAsync = require("../execAsync");

const parseResult = (output, getDefault) => {
  // We remove the first element from the result because
  // <code>wmic printer get name</code> will show a list of printers under "Name" title.
  const printers = output
    .trim()
    .split(/\s*[\r\n]+/)
    .slice(1);
  if (getDefault) {
    const defaultPrinter = printers.filter(e => e.indexOf("TRUE") === 0);
    if (!defaultPrinter || defaultPrinter.length === 0) {
      return "";
    }
    return defaultPrinter[0].replace(/TRUE\s+/, "");
  }

  return printers;
};

const list = getDefault => {
  let listArguments = "printer:get:name";
  if (getDefault) {
    listArguments += ",default";
  }
  return execAsync("wmic", listArguments.split(":"), result => {
    return parseResult(result, getDefault);
  });
};

module.exports = list;
