"use strict";

const execAsync = require("../execAsync");

const list = () => {
  const command = "lpstat -a";
  const stdoutHandler = stdout => {
    const result = stdout
      .trim()
      .split("\n")
      .map(e => e.substr(0, e.indexOf(" ")));
    console.log(result);
    return result;
  };

  return execAsync(command, stdoutHandler);
};

module.exports = list;
