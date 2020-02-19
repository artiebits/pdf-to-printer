"use strict";

import execAsync from "../../src/execAsync";
import { getPrinters, getDefaultPrinter } from "../../src/unix";

jest.mock("../../src/execAsync");

const mockPrinterListStdout = `
macOS_Printer accepting requests since Tue Aug  9 14:11:49 2016
Zebra accepting requests since Mon Aug 12 18:29:56 2019
    `;

const mockDefaultPrinterStdout = `
system default destination: EPSON
    `;

afterEach(() => {
  // restore the original implementation
  execAsync.mockRestore();
});

test("returns list of available printers", () => {
  execAsync.mockImplementation((_, [], callback) =>
    Promise.resolve(callback(mockPrinterListStdout))
  );
  return expect(getPrinters()).resolves.toStrictEqual([
    "macOS_Printer",
    "Zebra"
  ]);
});

test("returns the system default printer", () => {
  execAsync.mockImplementation((_, [], callback) =>
    Promise.resolve(callback(mockDefaultPrinterStdout))
  );
  return expect(getDefaultPrinter()).resolves.toStrictEqual("EPSON");
});

test("fails with an error", () => {
  execAsync.mockImplementation(() => Promise.reject("error"));
  return expect(getPrinters()).rejects.toBe("error");
});
