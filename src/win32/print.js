"use strict";

const path = require("path");
const fs = require("fs");
const execAsync = require("../execAsync");

const getCommand = (pdf, options) => {
  let command = path.join(__dirname, "SumatraPDF.exe");

  const { printer } = options;
  if (printer) {
    command += ` -print-to "${printer}"`;
  } else {
    command += " -print-to-default";
  }
  command += " -silent";
  command += ` ${pdf}`;

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
