"use strict";

const fs = require("fs");
const execAsync = require("../execAsync");

const escapeWhitespaces = path => path.replace(/(\s+)/g, "\\$1");

const print = (pdf, options = {}) => {
  if (!pdf) throw "No PDF specified";
  if (typeof pdf !== "string") throw "Invalid PDF name";
  if (!fs.existsSync(pdf)) throw "No such file";

  const params = [escapeWhitespaces(pdf)];

  const { printer } = options;
  if (printer) {
    params.push("-d", printer);
  }

  return execAsync("lp", params);
};

module.exports = print;
