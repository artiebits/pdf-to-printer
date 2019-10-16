"use strict";

const path = require("path");
const fs = require("fs");
const execAsync = require("../execAsync");
const { fixPathForAsarUnpack } = require("../electron-util");

const print = (pdf, options = {}) => {
  if (!pdf) throw "No PDF specified";
  if (typeof pdf !== "string") throw "Invalid PDF name";
  if (!fs.existsSync(pdf)) throw "No such file";

  let file = path.join(__dirname, "SumatraPDF.exe");
  file = fixPathForAsarUnpack(file);

  const args = [];

  const { printer } = options;

  if (printer) {
    args.push("-print-to", printer);
  } else {
    args.push("-print-to-default");
  }

  args.push("-silent", pdf);

  return execAsync(file, args);
};

module.exports = print;
