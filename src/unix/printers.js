"use strict";

const execAsync = require("../execAsync");

const getPrinters = () => {
  const parseResult = output => {
    return output
      .trim()
      .split("\n")
      .map(e => e.substr(0, e.indexOf(" ")));
  };
  return execAsync("lpstat", ["-a"], parseResult);
};

const getDefaultPrinter = () => {
  const parseResult = output => output.substr(output.indexOf(":") + 1).trim();
  return execAsync("lpstat", ["-d"], parseResult);
};

module.exports = {
  getPrinters,
  getDefaultPrinter
};
