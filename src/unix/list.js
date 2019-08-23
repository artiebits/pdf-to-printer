"use strict";

const execAsync = require("../execAsync");

const list = () => {
  const command = "lpstat -a";
  const stdoutHandler = stdout => {
    return stdout
      .trim()
      .split("\n")
      .map(e => e.substr(0, e.indexOf(" ")));
  };

  return execAsync(command, stdoutHandler);
};

module.exports = list;
