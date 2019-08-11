"use strict";

const fs = require("fs");
const execAsync = require("../execAsync");

const getCommand = (pdf, options) => {
  let command = "lp " + pdf;
  if (options.printer) {
    command += " -d " + options.printer;
  }
  // check for other options
  Object.keys(options).forEach(function(key) {
    if (key !== "printer") {
      const value = options[key];
      if (value !== false) {
        command += " -o " + key;
        if (typeof value !== "boolean") {
          command += "=" + value;
        }
      }
    }
  });
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
