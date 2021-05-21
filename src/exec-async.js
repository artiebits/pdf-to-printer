"use strict";

const { exec } = require("child_process");

const execAsync = (file, args = [], callback) => {
  return new Promise((resolve, reject) => {
    exec(file, args, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(callback ? callback(stdout) : stdout);
    });
  });
};

module.exports = execAsync;
