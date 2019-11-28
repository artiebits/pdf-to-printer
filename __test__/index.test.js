"use strict";

jest.mock("os");

describe.each([
  ["Linux", "linux"],
  ["Darwin", "darwin"],
  ["Windows", "win32"]
])("%i operating system", (_, alias) => {
  test("has `print` and `list` methods", () => {
    jest.resetModules();

    const os = require("os");
    os.platform.mockImplementation(() => alias);

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
