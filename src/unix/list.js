"use strict";

const execAsync = require("../execAsync");

const stdoutHandler = stdout =>
  stdout
    .trim()
    .split("\n")
    .map(e => e.substr(0, e.indexOf(" ")));

const list = () => execAsync("lpstat", ["-a"], stdoutHandler);

module.exports = list;
