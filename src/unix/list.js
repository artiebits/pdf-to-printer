"use strict";

const execAsync = require("../execAsync");

const parseResult = (output, getDefault) => {
  if (getDefault) {
    return output.trim().substr(output.indexOf(":") + 1);
  }

  return output
    .trim()
    .split("\n")
    .map(e => e.substr(0, e.indexOf(" ")));
};

const list = getDefault => {
  let listArgument = ["-a"];
  if (getDefault) {
    listArgument = ["-d"];
  }
  return execAsync("lpstat", listArgument, result => {
    return parseResult(result, getDefault);
  });
};

module.exports = list;
