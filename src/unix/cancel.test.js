"use strict";

import execAsync from "../utils/exec-async";
import cancel from "./cancel";
import observe from "./observe";
import print from "./print";

jest.mock("fs");
jest.mock("path");
jest.mock("../utils/exec-async");

afterEach(() => {
  // restore the original implementations
  execAsync.mockRestore();
});

test("throws if no jobId specified", async () => {
  try {
    await cancel();
  } catch (e) {
    expect(e).toMatch("No jobId specified");
  }
});

test("cancel printing on the default printer", async () => {
  const jobName = "om7nzw4arjo";

  await cancel(jobName);

  expect(execAsync).toHaveBeenCalledWith(`lprm ${jobName}`);
});

test("cancel printing on the specific printer", async () => {
  const jobName = "om7nzw4arjo";
  const printer = "Zebra";
  const options = {
    printer,
  };

  await cancel(jobName, options);

  expect(execAsync).toHaveBeenCalledWith(`lprm -P ${printer} ${jobName}`);
});

test("cancel printing on the specific server", async () => {
  const jobName = "om7nzw4arjo";
  const hostname = "192.168.1.5";
  const options = {
    hostname,
  };

  await cancel(jobName, options);

  expect(execAsync).toHaveBeenCalledWith(`lprm -h ${hostname} ${jobName}`);
});

test("cancel printing by the specific user", async () => {
  const jobName = "om7nzw4arjo";
  const username = "ivan";
  const options = {
    username,
  };

  await cancel(jobName, options);

  expect(execAsync).toHaveBeenCalledWith(`lprm -U ${username} ${jobName}`);
});

test("allows users to pass OS specific options", async () => {
  const jobName = "om7nzw4arjo";
  const printer = "Zebra";
  const options = { printer, unix: ["-o sides=one-sided"] };

  await cancel(jobName, options);

  expect(execAsync).toHaveBeenCalledWith(
    `lprm -P ${printer} -o sides=one-sided ${jobName}`
  );
});

test("throws if OS-specific options passed not as an array", async () => {
  const jobName = "om7nzw4arjo";
  const options = { unix: "-o sides=one-sided" };

  try {
    await cancel(jobName, options);
  } catch (e) {
    expect(e).toMatch("options.unix should be an array");
  }
});
