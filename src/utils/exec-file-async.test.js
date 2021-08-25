"use strict";

import { execFile } from "child_process";
import execAsync from "./exec-file-async";

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

test("calls callback", () => {
  // override the implementation
  execFile.mockImplementation((_, [], callback) =>
    callback(null, "some output")
  );

  return execAsync("my_command", [], (stdout) => {
    expect(stdout).toBe("some output");
  });
});

test("fails with an error", () => {
  // override the implementation
  execFile.mockImplementation((_, [], callback) => callback("error"));

  return expect(execAsync("my_command")).rejects.toBe("error");
});
