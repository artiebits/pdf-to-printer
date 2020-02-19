"use strict";

const execAsync = require("../execAsync");

const getPrinters = args => {
  const stdoutHandler = stdout =>
    stdout
      .trim()
      .split(/\s*[\r\n]+/)
      // We remove the first element from the result because
      // <code>wmic printer get name</code> will show a list of printers under "Name" title.
      .slice(1);
  // https://ss64.com/nt/wmic.html#alias_options
  return execAsync("wmic", args, stdoutHandler);
};

module.exports = {
  getPrinters: () => getPrinters(["printer", "get", "name"]),
  getDefaultPrinter: () => {
    return getPrinters(["printer", "get", "name,default"]).then(printers => {
      const defaultPrinter = printers.filter(e => e.indexOf("TRUE") === 0);
      if (defaultPrinter.length === 0) {
        return "";
      }
      return defaultPrinter[0].replace(/TRUE\s+/, "");
    });
  }
};
