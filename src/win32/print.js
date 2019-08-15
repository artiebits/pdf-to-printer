"use strict";

const path = require("path");
const fs = require("fs");
const execAsync = require("../execAsync");
const { fixPathForAsarUnpack } = require("../electron-util");

const print = (pdf, options = {}) => {
  if (!pdf) throw "No PDF specified";
  if (typeof pdf !== "string") throw "Invalid PDF name";
  if (!fs.existsSync(pdf)) throw "No such file";

  let command = path.join(__dirname, "SumatraPDF.exe");

  command = fixPathForAsarUnpack(command);

  const params = [];

  const { printer, win32 } = options;

  if (printer) {
    params.push("-print-to", printer);
  } else {
    params.push("-print-to-default");
  }

  if (win32) {
    if (!Array.isArray(win32)) throw "options.win32 should be an array";
    params.concat(win32);
  }

  params.push("-silent", pdf);

  return execAsync(command, params);
};

module.exports = print;
