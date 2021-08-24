"use strict";

import { existsSync } from "fs";
import execAsync from "../utils/exec-async";
import print from "./print";
import { getRandomJobName, findJobLineByName } from "../utils/observe-util";

jest.mock("fs");
jest.mock("path");
jest.mock("../utils/exec-async");
jest.mock("../utils/observe-util");

beforeEach(() => {
  // override the implementations
  existsSync.mockImplementation(() => true);
  execAsync.mockImplementation(() =>
    Promise.resolve({
      stdout: "some normal result that does not matter for most tests",
      stderr: "",
    })
  );
  getRandomJobName.mockImplementation(() => "om7nzw4arjo");
  findJobLineByName.mockImplementation(() => [
    "active  user   359     om7nzw4arjo 12288 байт",
    "active",
    "user",
    "om7nzw4arjo",
    "12288",
  ]);
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
  const jobName = "om7nzw4arjo";

  await print(filename);

  expect(execAsync).toHaveBeenCalledWith(`lp ${filename} -t ${jobName}`);
});

test("sends PDF file to the specific printer", async () => {
  const filename = "assets/pdf-sample.pdf";
  const printer = "Zebra";
  const options = {
    printer,
  };
  const jobName = "om7nzw4arjo";

  await print(filename, options);

  expect(execAsync).toHaveBeenCalledWith(
    `lp ${filename} -d ${printer} -t ${jobName}`
  );
});

test("sends PDF file to the specific printer with a space in its name", async () => {
  const filename = "assets/pdf-sample.pdf";
  const printer = "Brother HL-L2340WD";
  const options = { printer };
  const jobName = "om7nzw4arjo";

  await print(filename, options);

  expect(execAsync).toHaveBeenCalledWith(
    `lp ${filename} -d ${printer} -t ${jobName}`
  );
});

test("allows users to pass OS specific options", async () => {
  const filename = "assets/pdf-sample.pdf";
  const printer = "Zebra";
  const options = { printer, unix: ["-o sides=one-sided"] };
  const jobName = "om7nzw4arjo";

  await print(filename, options);

  expect(execAsync).toHaveBeenCalledWith(
    `lp ${filename} -d ${printer} -o sides=one-sided -t ${jobName}`
  );
});

test("throws if OS-specific options passed not as an array", async () => {
  const filename = "assets/pdf-sample.pdf";
  const options = { unix: "-o sides=one-sided" };

  await expect(print(filename, options)).rejects.toMatch(
    "options.unix should be an array"
  );
});

test("throws if could not find the created job with name", async () => {
  const filename = "assets/pdf-sample.pdf";
  const jobName = "om7nzw4arjo";
  findJobLineByName.mockImplementation(() => null);

  await expect(print(filename)).rejects.toEqual(
    new Error(`Could not find the created job with name "${jobName}"`)
  );
});

test("throws if lqp stdout is empty", async () => {
  const filename = "assets/pdf-sample.pdf";

  execAsync.mockImplementation((cmd) => {
    switch (true) {
      case cmd === "lpq":
        return Promise.resolve({
          stdout: "",
          stderr: "",
        });
      // for lp
      default:
        return Promise.resolve({
          stdout: "some normal result that does not matter for most tests",
          stderr: "",
        });
    }
  });

  await expect(print(filename)).rejects.toEqual(
    new Error('Empty stdout for command "lpq"')
  );
});

test("throws if lqp stderr is not empty", async () => {
  const filename = "assets/pdf-sample.pdf";
  const jobName = "om7nzw4arjo";

  execAsync.mockImplementation((cmd) => {
    switch (true) {
      case cmd === "lpq":
        return Promise.resolve({
          stdout: "some normal result that does not matter for most tests",
          stderr: "error description",
        });
      // for lp
      default:
        return Promise.resolve({
          stdout: "some normal result that does not matter for most tests",
          stderr: "",
        });
    }
  });

  await expect(print(filename)).rejects.toEqual(
    new Error('Failed to run command lpq: "error description"')
  );
});
