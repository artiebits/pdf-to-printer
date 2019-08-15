"use strict";

const { execFile } = require("child_process");

const execAsync = (command, params = [], callback) => {
  return new Promise((resolve, reject) => {
    execFile(command, params, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(callback ? callback(stdout) : stdout);
    });
  });
};

module.exports = execAsync;
