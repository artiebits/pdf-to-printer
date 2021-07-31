"use strict";

import { existsSync } from "fs";
import execAsync from "../utils/exec-async";
import print from "./print";

jest.mock("fs");
jest.mock("path");
jest.mock("../utils/exec-async");

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

test("throws if no PDF specified", async () => {
  await expect(print()).rejects.toMatch("No PDF specified");
});

test("throws if PDF name is invalid", async () => {
  await expect(print(123)).rejects.toMatch("Invalid PDF name");
});

test("throws if PDF doesn't exist", async () => {
  existsSync.mockImplementation(() => false);

  await expect(print("assets/pdf-sample.pdf")).rejects.toMatch("No such file");
});

test("sends the PDF file to the default printer", async () => {
  const filename = "assets/pdf-sample.pdf";

  await print(filename);

  expect(execAsync).toHaveBeenCalledWith(`lp ${filename}`);
});

test("sends PDF file to the specific printer", async () => {
  const filename = "assets/pdf-sample.pdf";
  const printer = "Zebra";
  const options = {
    printer,
  };

  await print(filename, options);

  expect(execAsync).toHaveBeenCalledWith(`lp ${filename} -d ${printer}`);
});

test("sends PDF file to the specific printer with a space in its name", async () => {
  const filename = "assets/pdf-sample.pdf";
  const printer = "Brother HL-L2340WD";
  const options = { printer };

  await print(filename, options);

  expect(execAsync).toHaveBeenCalledWith(`lp ${filename} -d ${printer}`);
});

test("allows users to pass OS specific options", async () => {
  const filename = "assets/pdf-sample.pdf";
  const printer = "Zebra";
  const options = { printer, unix: ["-o sides=one-sided"] };

  await print(filename, options);

  expect(execAsync).toHaveBeenCalledWith(
    `lp ${filename} -d ${printer} -o sides=one-sided`
  );
});

test("throws if OS-specific options passed not as an array", async () => {
  const filename = "assets/pdf-sample.pdf";
  const options = { unix: "-o sides=one-sided" };

  await expect(print(filename, options)).rejects.toMatch(
    "options.unix should be an array"
  );
});
