"use strict";

const splitArgs = require("../utils/split-args");
const execAsync = require("../utils/exec-async");

const cancel = (jobId, options = {}) => {
  if (!jobId) throw "No jobId specified";

  const args = [];

  const { printer, username, hostname, unix } = options;

  if (printer) {
    args.push("-P", printer);
  }

  if (username) {
    args.push("-U", username);
  }

  if (hostname) {
    args.push("-h", hostname);
  }

  if (unix) {
    if (!Array.isArray(unix)) throw "options.unix should be an array";
    unix
      .map(splitArgs)
      .reduce((acc, arg) => acc.concat(arg), [])
      .forEach((arg) => args.push(arg));
  }

  args.push(jobId);

  return execAsync(`lprm ${args.join(" ")}`);
};

module.exports = cancel;
