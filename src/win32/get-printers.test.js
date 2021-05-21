"use strict";

import execAsync from "../exec-file-async";
import getDefaultPrinter from "./get-default-printer";
import getPrinters from "./get-printers";

jest.mock("../../src/exec-file-async");

afterEach(() => {
  // restore the original implementation
  execAsync.mockRestore();
});

const mockPrinterListStdout = `DeviceID                       Name
OneNote                        OneNote
Microsoft XPS Document Writer  Microsoft XPS Document Writer
Microsoft Print to PDF         Microsoft Print to PDF
Fax                            Fax


`;

const mockPrinterListWithDefaultStdout = `Default  DeviceID                       Name
FALSE    OneNote for Windows 10         OneNote for Windows 10
FALSE    Microsoft XPS Document Writer  Microsoft XPS Document Writer
TRUE     Microsoft Print to PDF         Microsoft Print to PDF
FALSE    Fax                            Fax

`;

test("returns list of available printers", () => {
  execAsync.mockImplementation((_, [], callback) =>
    Promise.resolve(callback(mockPrinterListStdout))
  );
  // We do not expect "Name" to be in the result because
  // Windows will write to stdout a list of printers under "Name" title.
  return expect(getPrinters()).resolves.toStrictEqual([
    { deviceId: "OneNote", name: "OneNote" },
    {
      deviceId: "Microsoft XPS Document Writer",
      name: "Microsoft XPS Document Writer",
    },
    {
      deviceId: "Microsoft Print to PDF",
      name: "Microsoft Print to PDF",
    },
    {
      deviceId: "Fax",
      name: "Fax",
    },
  ]);
});

test("gets the default printer", () => {
  execAsync.mockImplementation((_, [], callback) =>
    Promise.resolve(callback(mockPrinterListWithDefaultStdout))
  );
  // We do not expect "Name" to be in the result because
  // Windows will write to stdout a list of printers under "Name" title.
  return expect(getDefaultPrinter()).resolves.toStrictEqual({
    deviceId: "Microsoft Print to PDF",
    name: "Microsoft Print to PDF",
  });
});

test("test no default printer defined", () => {
  execAsync.mockImplementation((_, [], callback) =>
    Promise.resolve(callback(""))
  );
  return expect(getDefaultPrinter()).resolves.toStrictEqual(false);
});

test("fails with an error", () => {
  execAsync.mockImplementation(() => Promise.reject("error"));
  return expect(getPrinters()).rejects.toBe("error");
});
