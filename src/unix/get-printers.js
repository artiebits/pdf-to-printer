"use strict";

const execAsync = require("../utils/exec-async");

async function getPrinters() {
  function parseResult(stdout) {
    return stdout
      .split(/^printer(.)/gm)
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const trimmed = line.trim();
        return {
          deviceId: trimmed.substr(0, trimmed.indexOf(" ")),
          name: trimmed
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
