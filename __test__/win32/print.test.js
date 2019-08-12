"use strict";

import { existsSync } from "fs";
import { join } from "path";
import execAsync from "../../src/execAsync";
import { fixPathForAsarUnpack } from "../../src/utils/electron-util";
import { print } from "../../src/win32";

jest.mock("fs");
jest.mock("path");
jest.mock("../../src/execAsync");
jest.mock("../../src/utils/electron-util");

beforeEach(() => {
  // override the implementations
  fixPathForAsarUnpack.mockImplementation(path => path);
  existsSync.mockImplementation(() => true);
  execAsync.mockImplementation(() => Promise.resolve());
  join.mockImplementation((_, filename) => "mocked_path_" + filename);
});

afterEach(() => {
  // restore the original implementations
  fixPathForAsarUnpack.mockRestore();
  existsSync.mockRestore();
  execAsync.mockRestore();
  join.mockRestore();
});

test("throws if no PDF specified", () => {
  const noPdfSpecified = () => print();
  expect(noPdfSpecified).toThrowError(new Error("No PDF specified"));
});

test("throws if PDF name is invalid", () => {
  const invalidName = () => print(123);
  expect(invalidName).toThrowError(new Error("Invalid PDF name"));
});

test("throws if PDF doesn't exist", () => {
  const noSuchFile = () => print("assets/no-such-file.pdf");
  existsSync.mockImplementation(() => false);
  expect(noSuchFile).toThrowError(new Error("No such file"));
});

test("sends the PDF file to the default printer", () => {
  const filename = "assets/pdf-sample.pdf";
  return print(filename).then(() => {
    expect(execAsync).toHaveBeenCalledWith(
      `mocked_path_SumatraPDF.exe -print-to-default -silent ${filename}`
    );
  });
});

test("sends PDF file to the specific printer", () => {
  const filename = "assets/pdf-sample.pdf";
  const printer = "Zebra";
  const options = { printer };
  return print(filename, options).then(() => {
    expect(execAsync).toHaveBeenCalledWith(
      `mocked_path_SumatraPDF.exe -print-to "${printer}" -silent ${filename}`
    );
  });
});

test("escapes whitespaces in the path", () => {
  join.mockImplementation((_, filename) => "mocked path/" + filename);
  const filename = "my assets/pdf-sample.pdf";
  return print(filename).then(() => {
    expect(execAsync).toHaveBeenCalledWith(
      "mocked\\ path/SumatraPDF.exe -print-to-default -silent my\\ assets/pdf-sample.pdf"
    );
  });
});
