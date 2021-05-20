"use strict";

import { existsSync } from "fs";
import execAsync from "../execAsync";
import observe from "./observe";

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

test("throws if no jobId specified", () => {
  const noPdfSpecified = () => observe();
  expect(noPdfSpecified).toThrowError(new Error("No jobId specified"));
});

test("throws if jobId name is invalid", () => {
  const invalidName = () => observe(123);
  expect(invalidName).toThrowError(new Error("Invalid jobId"));
});

test("throws if timeout is invalid", () => {
  const noPdfSpecified = () => observe(123, "some_string");
  expect(noPdfSpecified).toThrowError(new Error("Invalid timeout"));
});

test("throws if timeout is negative value", () => {
  const noPdfSpecified = () => observe(123, -123);
  expect(noPdfSpecified).toThrowError(new Error("Invalid timeout"));
});

test("throws if delay is invalid", () => {
  const noPdfSpecified = () => observe(123, 60000, "some_string");
  expect(noPdfSpecified).toThrowError(new Error("Invalid delay"));
});

test("throws if delay is negative value", () => {
  const noPdfSpecified = () => observe(123, 60000, -1000);
  expect(noPdfSpecified).toThrowError(new Error("Invalid delay"));
});

test("checks status of the default printer", () => {
  return print(123).then(() => {
    expect(execAsync).toHaveBeenCalledWith("lpstat -W not-completed", []);
  });
});

test("checks status of the specific printer", () => {
  const jobId = 123;
  const printer = "Zebra";
  const options = {
    printer,
  };
  return observe(jobId, 60000, 1000, options).then(() => {
    expect(execAsync).toHaveBeenCalledWith("lpstat -W not-completed", [
      "-d",
      printer,
    ]);
  });
});

test("checks status of the specific printer with a space in its name", () => {
  const jobId = 123;
  const printer = "Brother HL-L2340WD";
  const options = { printer };
  return observe(jobId, 60000, 1000, options).then(() => {
    expect(execAsync).toHaveBeenCalledWith("lpstat -W not-completed", [
      "-d",
      printer,
    ]);
  });
});

test("allows users to pass OS specific options", () => {
  const jobId = 123;
  const printer = "Zebra";
  const options = { printer, unix: ["-o some-option-name=some-option-value"] };
  return observe(jobId, 60000, 1000, options).then(() => {
    expect(execAsync).toHaveBeenCalledWith("lpstat -W not-completed", [
      "-d",
      printer,
      "-o",
      "some-option-name=some-option-value",
    ]);
  });
});

test("it throws if OS-specific options passed not as an array.", () => {
  const jobId = 123;
  const options = { unix: "-o sides=one-sided" };
  const isNotArray = () => observe(jobId, 60000, 1000, options);
  expect(isNotArray).toThrowError(new Error("options.unix should be an array"));
});
