"use strict";

jest.mock("os");

describe.each([
  ["Linux", "linux"],
  ["Darwin", "darwin"],
  ["Windows", "win32"],
])("%i operating system", (_, alias) => {
  test("has `print`, `getDefaultPrinter` and `getPrinters` methods", () => {
    jest.resetModules();

    const os = require("os");
    os.platform.mockImplementation(() => alias);

    const printer = require("./index");

    expect(printer.print).toBeDefined();
    expect(printer.getDefaultPrinter).toBeDefined();
    expect(printer.getPrinters).toBeDefined();
  });
});

describe("Unsupported platform", () => {
  test("throws on unsupported platforms", () => {
    jest.resetModules();

    const os = require("os");
    os.platform.mockImplementation(() => "test");

    expect(() => require("./index")).toThrowError(
      new Error("Platform not supported")
    );
  });
});
