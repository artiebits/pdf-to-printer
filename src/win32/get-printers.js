"use strict";

const execAsync = require("../execAsync");

const getPrinters = () => {
  const stdoutHandler = (stdout) =>
    stdout
      .trim()
      .split(/\s*[\r\n]+/)
      // We remove the first element from the result because
      // <code>wmic printer get name</code> will show a list of printers under "Name" title.
      .slice(1);
  // https://ss64.com/nt/wmic.html#alias_options
  return execAsync("wmic", ["printer", "get", "name"], stdoutHandler);
};

module.exports = getPrinters;
