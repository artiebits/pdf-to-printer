"use strict";

const path = require("path");
const fs = require("fs");
const splitArgs = require("../utils/split-args");
const execAsync = require("../utils/exec-file-async");
const fixPathForAsarUnpack = require("../utils/electron-util");

const validDestinationArgs = [
  "-print-to",
  "-print-to-default",
  "-print-dialog",
];

function print(pdf, options = {}) {
  if (!pdf) throw "No PDF specified";
  if (typeof pdf !== "string") throw "Invalid PDF name";
  if (!fs.existsSync(pdf)) throw "No such file";

  let sumatraPdf =
    options.sumatraPdfPath || path.join(__dirname, "SumatraPDF.exe");
  if (!options.sumatraPdfPath) sumatraPdf = fixPathForAsarUnpack(sumatraPdf);

  const args = [];

  const { printer, win32 } = options;

  if (win32) {
    if (!Array.isArray(win32)) throw "options.win32 should be an array";
    win32
      .map(splitArgs)
      .reduce((acc, arg) => acc.concat(arg), [])
      .forEach((arg) => args.push(arg));
  }

  let validDestination = false;
  args.some((a) => {
    const fullMatch = validDestinationArgs.indexOf(a) > -1;
    if (fullMatch) {
      validDestination = true;
      return true;
    } else {
      return false;
    }
  });

  if (!validDestination) {
    if (printer) {
      args.push("-print-to", printer);
    } else {
      args.push("-print-to-default");
    }
    args.push("-silent");
  }

  args.push(pdf);

  return execAsync(sumatraPdf, args);
}

module.exports = print;
