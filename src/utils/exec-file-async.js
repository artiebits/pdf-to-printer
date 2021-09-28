"use strict";

const { execFile } = require("child_process");
const util = require("util");
const execFileAsync = util.promisify(execFile);

module.exports = execFileAsync;
