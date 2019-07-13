"use strict";

const path = jest.genMockFromModule("path");

const join = (_, filename) => "mocked_path_" + filename;

path.join = join;

module.exports = path;
