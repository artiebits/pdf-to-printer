"use strict";

const execAsync = require("../execAsync");

const getPrinters = () => {
  const parseResult = (output) => {
    return output
      .split("printer")
      .slice(1)
      .map((e) => {
        e = e.trim();
        return {
          name: e.substr(0, e.indexOf(" ")),
          displayName: e
            .split("\n")
            .slice(1)
            .find((line) => line.indexOf("Description") !== -1)
            ?.split(":")[1]
            .trim(),
        };
      });
  };
  return execAsync("lpstat", ["-lp"], parseResult);
};

module.exports = getPrinters;
