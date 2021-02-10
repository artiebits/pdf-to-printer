"use strict";

const fs = require("fs");
const splitArgs = require("../split-args");
const execAsync = require("../execAsync");

const print = (pdf, options = {}) => {
  if (!pdf) throw "No PDF specified";
  if (typeof pdf !== "string") throw "Invalid PDF name";
  if (!fs.existsSync(pdf)) throw "No such file";

  const args = [pdf];

  const { printer, unix } = options;

  if (printer) {
    args.push("-d", printer);
  }

  if (unix) {
    if (!Array.isArray(unix)) throw "options.unix should be an array";
    unix
      .map(splitArgs)
      .reduce((acc, arg) => acc.concat(arg), [])
      .forEach((arg) => args.push(arg));
  }

  return execAsync("lp", args);
};

module.exports = print;
