"use strict";

const fs = require("fs");
const splitArgs = require("../split-args");
const execAsync = require("../execAsync");

// @see https://www.computerhope.com/unix/ulpstat.htm
// @see https://www.computerhope.com/unix/ulpq.htm

const observe = (jobId, timeout = 60000, delay = 1000, options = {}) => {
  if (!jobId) throw "No jobId specified";
  if (typeof jobId !== "string") throw "Invalid jobId";
  if (typeof timeout !== "number" || timeout < 0) throw "Invalid timeout";
  if (typeof delay !== "number" || delay < 0) throw "Invalid delay";

  const args = [];

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

  let passedTime = 0;
  let timer;

  return new Promise((resolve, reject) => {
    timer = setInterval(() => {
      if (passedTime >= timeout) {
        resolve("outdated");
        clearInterval(timer);
        return;
      }

      // grep ?
      execAsync("lpstat -W not-completed", args)
        .then((res) => {
          const exists = res.split("\n").find((s) => {
            return s.includes(" " + jobId + " ");
          });
          if (exists) {
            resolve(exists ? "incomplete" : "completed");
          }
        })
        .catch((e) => {
          reject(e);
          clearInterval(timer);
        });
      passedTime += delay;
    }, delay);
  });
};

module.exports = observe;
