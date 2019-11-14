"use strict";

const fs = require("fs");
const execAsync = require("../execAsync");

const print = (pdf, options = {}) => {
  if (!pdf) throw "No PDF specified";
  if (typeof pdf !== "string") throw "Invalid PDF name";
  if (!fs.existsSync(pdf)) throw "No such file";

  const args = [pdf];

  const { printer } = options;

  if (printer) {
    args.push("-d", printer);
  }

  return execAsync("lp", args);
};

module.exports = print;
