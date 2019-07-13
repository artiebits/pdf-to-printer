"use strict";

import execAsync from "../../src/execAsync";
import { list } from "../../src/unix";

jest.mock("../../src/execAsync");

const mockStdout = `
macOS Printer
Zebra
    `;

afterEach(() => {
  // restore the original implementation
  execAsync.mockRestore();
});

test("returns list of available printers", () => {
  execAsync.mockImplementation((_, callback) =>
    Promise.resolve(callback(mockStdout))
  );
  return expect(list()).resolves.toStrictEqual(["macOS Printer", "Zebra"]);
});

test("fails with an error", () => {
  execAsync.mockImplementation(() => Promise.reject("error"));
  return expect(list()).rejects.toBe("error");
});
