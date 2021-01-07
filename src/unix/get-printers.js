"use strict";

const execAsync = require("../execAsync");

const getPrinters = () => {
  const parseResult = (output) => {
    return output
      .trim()
      .split("\n")
      .map((e) => e.substr(0, e.indexOf(" ")));
  };
  return execAsync("lpstat", ["-a"], parseResult);
};

module.exports = getPrinters;
