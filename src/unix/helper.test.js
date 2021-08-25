"use strict";

import { getRandomJobName, findJobLineByName, findJobLineById } from "./helper";

test("getRandomJobName returns string", () => {
  expect(typeof getRandomJobName()).toBe("string");
});

test("findJobLineByName correctly find the job line", () => {
  const output = `
Hewlett-Packard-HP-LaserJet-P2055dn готов и печатает
Ранг    Владелец   Задание     Файл(ы)                     Общий размер
active  user   359     om7nzw4arjo 12288 байт
`;
  const res = findJobLineByName("om7nzw4arjo", output);

  expect(res[0]).toBe("active  user   359     om7nzw4arjo 12288 байт");
  expect(res[1]).toBe("active");
  expect(res[2]).toBe("user");
  expect(res[3]).toBe("359");
  expect(res[4]).toBe("12288");
});

test("findJobLineByName returns null if the job line is not found", () => {
  const output = `
Hewlett-Packard-HP-LaserJet-P2055dn готов и печатает
Ранг    Владелец   Задание     Файл(ы)                     Общий размер
active  user   359     om7nzw4arjo 12288 байт
`;
  expect(findJobLineByName("not-found-name", output)).toBeNull();
});

test("findJobLineById correctly find the job line", () => {
  const output = `
Hewlett-Packard-HP-LaserJet-P2055dn готов и печатает
Ранг    Владелец   Задание     Файл(ы)                     Общий размер
active  user   359     om7nzw4arjo 12288 байт
`;
  const res = findJobLineById("359", output);

  expect(res[0]).toBe("active  user   359     om7nzw4arjo 12288 байт");
  expect(res[1]).toBe("active");
  expect(res[2]).toBe("user");
  expect(res[3]).toBe("om7nzw4arjo");
  expect(res[4]).toBe("12288");
});

test("findJobLineById returns null if the job line is not found", () => {
  const output = `
Hewlett-Packard-HP-LaserJet-P2055dn готов и печатает
Ранг    Владелец   Задание     Файл(ы)                     Общий размер
active  user   359     om7nzw4arjo 12288 байт
`;
  expect(findJobLineById("not-found-id", output)).toBeNull();
});
