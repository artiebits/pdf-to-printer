"use strict";

const execAsync = require("../utils/exec-async");

async function getPrinters() {
  function parseResult(stdout) {
    return stdout
      .split("printer")
      .slice(1)
      .map((e) => {
        e = e.trim();
        return {
          deviceId: e.substr(0, e.indexOf(" ")),
          name: e
            .split("\n")
            .slice(1)
            .find((line) => line.indexOf("Description") !== -1)
            .split(":")[1]
            .trim(),
        };
      });
  }

  try {
    const { stdout } = await execAsync("lpstat -lp");
    return parseResult(stdout);
  } catch (error) {
    throw error;
  }
}

module.exports = getPrinters;
