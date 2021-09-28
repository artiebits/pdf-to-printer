"use strict";

// Taken from https://github.com/sindresorhus/electron-util/blob/master/node.js

const isElectron = "electron" in process.versions;

const isUsingAsar =
  isElectron &&
  process.mainModule &&
  process.mainModule.filename.includes("app.asar");

function fixPathForAsarUnpack(path) {
  return isUsingAsar ? path.replace("app.asar", "app.asar.unpacked") : path;
}

module.exports = fixPathForAsarUnpack;
