"use strict";

const execAsync = require("../execAsync");

const list = () => {
  const command = "lpstat -e";
  const stdoutHandler = stdout => stdout.trim().split("\n");

  return execAsync(command, stdoutHandler);
};

module.exports = list;
