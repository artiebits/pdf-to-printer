"use strict";

import observe from "./observe";

test("throws exception on win32", async () => {
  try {
    await observe();
  } catch (e) {
    expect(e).toEqual(new Error("The method is not yet implemented for win32"));
  }
});
