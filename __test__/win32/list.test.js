"use strict";

import execAsync from "../../src/execAsync";
import { list } from "../../src/win32";

jest.mock("../../src/execAsync");

afterEach(() => {
  // restore the original implementation
  execAsync.mockRestore();
});

const mockStdout = `
Name                        

Windows Printer         

Zebra                            

        `;

test("returns list of available printers", () => {
  execAsync.mockImplementation((_, callback) =>
    Promise.resolve(callback(mockStdout))
  );
  // We do not expect "Name" to be in the result because
  // Windows will write to stdout a list of printers under "Name" title.
  return expect(list()).resolves.toStrictEqual(["Windows Printer", "Zebra"]);
});

test("fails with an error", () => {
  execAsync.mockImplementation(() => Promise.reject("error"));
  return expect(list()).rejects.toBe("error");
});
