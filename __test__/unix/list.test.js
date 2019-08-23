"use strict";

import execAsync from "../../src/execAsync";
import { list } from "../../src/unix";

jest.mock("../../src/execAsync");

const mockStdout = `
macOS_Printer accepting requests since Tue Aug  9 14:11:49 2016
Zebra accepting requests since Mon Aug 12 18:29:56 2019
    `;

afterEach(() => {
  // restore the original implementation
  execAsync.mockRestore();
});

test("returns list of available printers", () => {
  execAsync.mockImplementation((_, callback) =>
    Promise.resolve(callback(mockStdout))
  );
  return expect(list()).resolves.toStrictEqual(["macOS_Printer", "Zebra"]);
});

test("fails with an error", () => {
  execAsync.mockImplementation(() => Promise.reject("error"));
  return expect(list()).rejects.toBe("error");
});
