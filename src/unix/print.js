"use strict";

const fs = require("fs");
const execAsync = require("../execAsync");
const escapeWhitespaces = require("../utils/escape-whitespaces");

const getCommand = (pdf, options) => {
  let command = "lp " + escapeWhitespaces(pdf);
  if (options.printer) {
    command += " -d " + options.printer;
  }
  return command;
};

const print = (pdf, options = {}) => {
  if (!pdf) throw "No PDF specified";
  if (typeof pdf !== "string") throw "Invalid PDF name";
  if (!fs.existsSync(pdf)) throw "No such file";

  const command = getCommand(pdf, options);
  return execAsync(command);
};

module.exports = print;
