"use strict";

const execAsync = require("../execAsync");

const list = () => {
  const stdoutHandler = stdout => stdout.trim().split("\n");

  return execAsync("lpstat", ["-e"], stdoutHandler);
};

module.exports = list;
