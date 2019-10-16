"use strict";

const { execFile } = require("child_process");

const execAsync = (file, args = [], callback) => {
  return new Promise((resolve, reject) => {
    execFile(file, args, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(callback ? callback(stdout) : stdout);
    });
  });
};

module.exports = execAsync;
