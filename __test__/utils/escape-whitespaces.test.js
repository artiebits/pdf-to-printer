"use strict";

import escapeWhitespaces from "../../src/utils/escape-whitespaces";

test("escapes whitespaces", () => {
  expect(escapeWhitespaces("mocked path")).toBe("mocked\\ path");
});
