"use strict";

const fs = require("fs");
const splitArgs = require("../utils/split-args");
const execAsync = require("../utils/exec-async");
const {
  getRandomJobName,
  findJobLineByName,
} = require("../utils/observe-util");

async function print(pdf, options = {}) {
  if (!pdf) throw "No PDF specified";
  if (typeof pdf !== "string") throw "Invalid PDF name";
  if (!fs.existsSync(pdf)) throw "No such file";

  const args = [pdf];

  const { printer, unix } = options;

  if (printer) {
    args.push("-d", printer);
  }

  if (unix) {
    if (!Array.isArray(unix)) throw "options.unix should be an array";
    unix
      .map(splitArgs)
      .reduce((acc, arg) => acc.concat(arg), [])
      .forEach((arg) => args.push(arg));
  }

  // we need to set unique job's name for easy finding it in the future
  const jobName = getRandomJobName();
  args.push("-t", jobName);

  return execAsync(`lp ${args.join(" ")}`)
    .then(() => execAsync("lpq"))
    .then((output) => {
      if (output.stderr) {
        throw new Error(`Failed to run command lpq: "${output.stderr}"`);
      }

      if (!output.stdout) {
        throw new Error('Empty stdout for command "lpq"');
      }

      const match = findJobLineByName(jobName, output.stdout);
      if (null === match) {
        throw new Error(
          `Could not find the created job with name "${jobName}"`
        );
      }

      // we can use jobName instead of jobId, but this step allow us to check up the result of queueing
      return match[3];
    });
}

module.exports = print;
