"use strict";

import { exec } from "child_process";
import execAsync from "./exec-async";

jest.mock("child_process");

afterEach(() => {
  // restore the original implementation
  exec.mockRestore();
});

test("runs the passed command in a shell", () => {
  // override the implementation
  exec.mockImplementation((_, callback) => callback());

  return execAsync("my_command").then(() => {
    expect(exec).toHaveBeenCalledWith("my_command", expect.any(Function));
  });
});

test("fails with an error", () => {
  // override the implementation
  exec.mockImplementation((_, callback) => callback("error"));

  return expect(execAsync("my_command")).rejects.toBe("error");
});
