"use strict";

import { execFile } from "child_process";
import execAsync from "./execAsync";

jest.mock("child_process");

afterEach(() => {
  // restore the original implementation
  execFile.mockRestore();
});

test("runs the passed command in a shell", () => {
  // override the implementation
  execFile.mockImplementation((_, [], callback) => callback());

  return execAsync("my_command").then(() => {
    expect(execFile).toHaveBeenCalledWith(
      "my_command",
      [],
      expect.any(Function)
    );
  });
});

test("fails with an error", () => {
  // override the implementation

  execFile.mockImplementation((_, [], callback) => callback("error"));

  return expect(execAsync("my_command")).rejects.toBe("error");
});
