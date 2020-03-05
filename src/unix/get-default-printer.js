"use strict";

const execAsync = require("../execAsync");

const getDefaultPrinter = () => {
  const parseResult = output => output.trim().substr(output.indexOf(":") + 1);
  return execAsync("lpstat", ["-d"], parseResult);
};

module.exports = getDefaultPrinter;
