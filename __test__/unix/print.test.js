"use strict";

import { existsSync } from "fs";
import execAsync from "../../src/execAsync";
import { print } from "../../src/unix";

jest.mock("fs");
jest.mock("path");
jest.mock("../../src/execAsync");

beforeEach(() => {
  // override the implementations
  existsSync.mockImplementation(() => true);
  execAsync.mockImplementation(() => Promise.resolve());
});

afterEach(() => {
  // restore the original implementations
  existsSync.mockRestore();
  execAsync.mockRestore();
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
  const noSuchFile = () => print("assets/pdf-sample.pdf");
  existsSync.mockImplementation(() => false);
  expect(noSuchFile).toThrowError(new Error("No such file"));
});

test("sends the PDF file to the default printer", () => {
  const filename = "assets/pdf-sample.pdf";
  return print(filename).then(() => {
    expect(execAsync).toHaveBeenCalledWith(`lp ${filename}`);
  });
});

test("sends PDF file to the specific printer", () => {
  const filename = "assets/pdf-sample.pdf";
  const printer = "Zebra";
  const options = {
    printer
  };
  return print(filename, options).then(() => {
    expect(execAsync).toHaveBeenCalledWith(`lp ${filename} -d ${printer}`);
  });
});

test("appends additional options with -o flag", () => {
  const filename = "assets/pdf-sample.pdf";
  const printer = "Zebra";
  const options = {
    printer,
    "fit-to-page": true,
    media: "A4",
    landscape: true
  };
  return print(filename, options).then(() => {
    expect(execAsync).toHaveBeenCalledWith(
      `lp ${filename} -d ${printer} -o fit-to-page -o media=A4 -o landscape`
    );
  });
});

test("ignores options set to false", () => {
  const filename = "assets/pdf-sample.pdf";
  const printer = "Zebra";
  const options = {
    printer,
    "fit-to-page": true,
    media: "A4",
    landscape: false
  };
  return print(filename, options).then(() => {
    expect(execAsync).toHaveBeenCalledWith(
      `lp ${filename} -d ${printer} -o fit-to-page -o media=A4`
    );
  });
});
