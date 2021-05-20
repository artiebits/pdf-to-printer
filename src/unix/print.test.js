"use strict";

import { existsSync } from "fs";
import execAsync from "../execAsync";
import print from "./print";
import { getRandomJobName, findJobLineByName } from "./helper";

jest.mock("fs");
jest.mock("path");
jest.mock("../../src/execAsync");
jest.mock("./helper");

beforeEach(() => {
  // override the implementations
  existsSync.mockImplementation(() => true);
  execAsync.mockImplementation(() => Promise.resolve());
  getRandomJobName.mockImplementation(() => "om7nzw4arjo");
  findJobLineByName.mockImplementation(() => [
    "active  user   359     om7nzw4arjo 12288 байт",
    "active",
    "user",
    "om7nzw4arjo",
    "12288",
  ]);
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
    expect(execAsync).toHaveBeenCalledWith("lp", [
      filename,
      "-t",
      "om7nzw4arjo",
    ]);
  });
});

test("sends PDF file to the specific printer", () => {
  const filename = "assets/pdf-sample.pdf";
  const printer = "Zebra";
  const options = {
    printer,
  };
  return print(filename, options).then(() => {
    expect(execAsync).toHaveBeenCalledWith("lp", [
      filename,
      "-d",
      printer,
      "-t",
      "om7nzw4arjo",
    ]);
  });
});

test("sends PDF file to the specific printer with a space in its name", () => {
  const filename = "assets/pdf-sample.pdf";
  const printer = "Brother HL-L2340WD";
  const options = { printer };
  return print(filename, options).then(() => {
    expect(execAsync).toHaveBeenCalledWith("lp", [
      filename,
      "-d",
      printer,
      "-t",
      "om7nzw4arjo",
    ]);
  });
});

test("allows users to pass OS specific options", () => {
  const filename = "assets/pdf-sample.pdf";
  const printer = "Zebra";
  const options = { printer, unix: ["-o sides=one-sided"] };
  return print(filename, options).then(() => {
    expect(execAsync).toHaveBeenCalledWith("lp", [
      filename,
      "-d",
      printer,
      "-o",
      "sides=one-sided",
      "-t",
      "om7nzw4arjo",
    ]);
  });
});

test("it throws if OS-specific options passed not as an array.", () => {
  const filename = "assets/pdf-sample.pdf";
  const options = { unix: "-o sides=one-sided" };
  const isNotArray = () => print(filename, options);
  expect(isNotArray).toThrowError(new Error("options.unix should be an array"));
});

test("throws if could not find the created job with name", () => {
  findJobLineByName.mockImplementation(() => null);

  // expect.assertions(1)
  return print("assets/pdf-sample.pdf").catch((e) => {
    expect(e).toEqual(
      new Error('Could not find the created job with name "om7nzw4arjo"')
    );
  });
});
