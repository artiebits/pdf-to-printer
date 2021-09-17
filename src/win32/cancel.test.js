"use strict";

import cancel from "./cancel";

test("throws exception on win32", async () => {
  try {
    await cancel();
  } catch (e) {
    expect(e).toEqual(new Error("The method is not yet implemented for win32"));
  }
});
