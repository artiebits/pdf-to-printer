"use strict";

const splitArgs = require("../utils/split-args");
const execAsync = require("../utils/exec-async");
const { findJobLineById } = require("./helper");

const STATUS_OUTDATED = "outdated";
const STATUS_COMPLETED = "completed";

// @see https://www.computerhope.com/unix/ulpstat.htm
// @see https://www.computerhope.com/unix/ulpq.htm
const observe = (jobId, timeout = 60000, delay = 1000, options = {}) => {
  if (!jobId) throw "No jobId specified";
  if (!Number.isInteger(timeout) || timeout < 0) throw "Invalid timeout";
  if (!Number.isInteger(delay) || delay < 0) throw "Invalid delay";

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

  let startedTime = new Date();
  let passedTime;
  let timer;

  return new Promise((resolve, reject) => {
    timer = setInterval(() => {
      passedTime = new Date().getTime() - startedTime.getTime();

      execAsync("lpq", args)
        .then((output) => {
          const line = findJobLineById(jobId, output);

          // if the job is not found in the queue we will consider that it was completed
          if (null === line) {
            resolve(STATUS_COMPLETED);
            clearInterval(timer);
            return;
          }

          // if the timeout is reached and the job is still not completed we will consider that the job was outdated
          if (passedTime >= timeout) {
            resolve(STATUS_OUTDATED);
            clearInterval(timer);
          }
        })
        .catch((e) => reject(e));
    }, delay);
  });
};

module.exports = observe;
