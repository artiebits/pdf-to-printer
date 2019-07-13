"use strict";

jest.mock("os");

describe("Linux", () => {
  test("has `print` and `list` methods", () => {
    jest.resetModules();

    const os = require("os");
    os.platform.mockImplementation(() => "darwin");

    const printer = require("../src");

    expect(printer.print).toBeDefined();
    expect(printer.list).toBeDefined();
  });
});

describe("Darwin", () => {
  test("has `print` and `list` methods", () => {
    jest.resetModules();

    const os = require("os");
    os.platform.mockImplementation(() => "darwin");

    const printer = require("../src");

    expect(printer.print).toBeDefined();
    expect(printer.list).toBeDefined();
  });
});

describe("Windows", () => {
  test("has `print` and `list` methods", () => {
    jest.resetModules();

    const os = require("os");
    os.platform.mockImplementation(() => "win32");

    const printer = require("../src");

    expect(printer.print).toBeDefined();
    expect(printer.list).toBeDefined();
  });
});

describe("Unsupported platform", () => {
  test("throws on unsupported platforms", () => {
    jest.resetModules();

    const os = require("os");
    os.platform.mockImplementation(() => "test");

    expect(() => require("../src")).toThrowError(
      new Error("Platform not supported")
    );
  });
});
