"use strict";

import { existsSync } from "fs";
import execAsync from "../execAsync";
import observe from "./observe";

jest.mock("fs");
jest.mock("path");
jest.mock("../../src/execAsync");

beforeEach(() => {
  // override the implementations
  existsSync.mockImplementation(() => true);
  execAsync.mockImplementation(() => Promise.resolve());
});

afterEach(() => {
  // restore the original implementations
  existsSync.mockRestore();
  execAsync.mockRestore();
});

test("throws if no jobId specified", async () => {
  try {
    await observe();
  } catch (e) {
    expect(e).toMatch("No jobId specified");
  }
});

test("throws if timeout is invalid", async () => {
  try {
    await observe("123", "some_string");
  } catch (e) {
    expect(e).toMatch("Invalid timeout");
  }
});

test("throws if timeout is negative value", async () => {
  try {
    await observe("123", -100);
  } catch (e) {
    expect(e).toMatch("Invalid timeout");
  }
});

test("throws if delay is invalid", async () => {
  try {
    await observe("123", 60000, "some_string");
  } catch (e) {
    expect(e).toMatch("Invalid delay");
  }
});

test("throws if delay is negative value", async () => {
  try {
    await observe("123", 60000, -1000);
  } catch (e) {
    expect(e).toMatch("Invalid delay");
  }
});

test("checks status of the default printer", async () => {
  await observe("123");
  expect(execAsync).toHaveBeenCalledWith("lpq", []);
});

test("checks status of the specific printer", async () => {
  const printer = "Zebra";
  const options = {
    printer,
  };

  await observe("123", 60000, 1000, options);
  expect(execAsync).toHaveBeenCalledWith("lpq", ["-P", printer]);
});

test("checks status of the specific printer with a space in its name", async () => {
  const printer = "Brother HL-L2340WD";
  const options = { printer };

  await observe("123", 60000, 1000, options);
  expect(execAsync).toHaveBeenCalledWith("lpq", ["-P", printer]);
});

test("checks status with defined username", async () => {
  const username = "ivan";
  const options = { username };

  await observe("123", 60000, 1000, options);
  expect(execAsync).toHaveBeenCalledWith("lpq", ["-U", username]);
});

test("checks status of the specific hostname", async () => {
  const hostname = "192.168.1.10";
  const options = { hostname };

  await observe("123", 60000, 1000, options);
  expect(execAsync).toHaveBeenCalledWith("lpq", ["-h", hostname]);
});

test("allows users to pass OS specific options", async () => {
  const options = { unix: ["-o some-option-name=some-option-value"] };

  await observe("123", 60000, 1000, options);
  expect(execAsync).toHaveBeenCalledWith("lpq", [
    "-o",
    "some-option-name=some-option-value",
  ]);
});

test("it throws if OS-specific options passed not as an array.", async () => {
  const options = { unix: "-o sides=one-sided" };
  try {
    await observe("123", 60000, 1000, options);
  } catch (e) {
    expect(e).toMatch("options.unix should be an array");
  }
});

test('returns "outdated" if timeout expired and the job still in the queue', async () => {
  // we need wait longer
  jest.setTimeout(10000);

  const output = `
LaserJetP2055dn готов и печатает
Ранг    Владелец   Задание     Файл(ы)                     Общий размер
active  user   302     Команда LPQ              386048 байт
1st     user   304     Команда LPQ              386048 байт
2nd     user   305     lpq Command - IBM Documentation 38912 байт
3rd     user   306     rde - Поиск в Google      329728 байт
4th     user   307     rde - Поиск в Google      329728 байт
5th     user   308     rde - Поиск в Google      329728 байт
6th     user   309     RegExp - JavaScript _ MDN       662528 байт
7th     user   310     66 - Поиск в Google       280576 байт
8th     user   311     66 - Поиск в Google       290816 байт
10th    user   313     RegExp - JavaScript _ MDN       662528 байт
`;
  execAsync.mockImplementation(() => Promise.resolve(output));

  const res = await observe(307, 2000, 500);
  expect(res).toBe("outdated");
});

test('returns "completed" if the job disappeared before than the timeout expired', async (done) => {
  // we need to wait longer
  jest.setTimeout(10000);

  const output1 = `
LaserJetP2055dn готов и печатает
Ранг    Владелец   Задание     Файл(ы)                     Общий размер
active  user   302     Команда LPQ              386048 байт
1st     user   304     Команда LPQ              386048 байт
2nd     user   305     lpq Command - IBM Documentation 38912 байт
3rd     user   306     rde - Поиск в Google      329728 байт
4th     user   307     rde - Поиск в Google      329728 байт
5th     user   308     rde - Поиск в Google      329728 байт
6th     user   309     RegExp - JavaScript _ MDN       662528 байт
7th     user   310     66 - Поиск в Google       280576 байт
8th     user   311     66 - Поиск в Google       290816 байт
10th    user   313     RegExp - JavaScript _ MDN       662528 байт
`;

  const output2 = `
LaserJetP2055dn готов и печатает
Ранг    Владелец   Задание     Файл(ы)                     Общий размер
active  user   302     Команда LPQ              386048 байт
1st     user   304     Команда LPQ              386048 байт
2nd     user   305     lpq Command - IBM Documentation 38912 байт
3rd     user   306     rde - Поиск в Google      329728 байт
5th     user   308     rde - Поиск в Google      329728 байт
6th     user   309     RegExp - JavaScript _ MDN       662528 байт
7th     user   310     66 - Поиск в Google       280576 байт
8th     user   311     66 - Поиск в Google       290816 байт
10th    user   313     RegExp - JavaScript _ MDN       662528 байт
`;

  execAsync.mockImplementation(() => Promise.resolve(output1));

  // disappearance emulation
  setTimeout(() => {
    execAsync.mockImplementation(() => Promise.resolve(output2));
  }, 3000);

  const res = await observe(307, 4500, 500);
  expect(res).toBe("completed");

  setTimeout(() => {
    done();
  }, 6000);
});
