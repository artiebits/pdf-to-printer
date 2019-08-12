"use strict";

const originalProcess = process;

afterEach(() => {
  jest.resetModules();
  // restore the original process object
  global.process = originalProcess;
});

test("fixes path for Electron apps", () => {
  const path =
    "/Users/artiebits/My.app/Contents/Resources/app.asar/node_modules/foo/binary";

  global.process = {
    ...originalProcess,
    versions: {
      electron: "0.0.0"
    },
    mainModule: {
      filename: "/app.asar/index.html"
    }
  };

  expect(require("../src/electron-util").fixPathForAsarUnpack(path)).toBe(
    "/Users/artiebits/My.app/Contents/Resources/app.asar.unpacked/node_modules/foo/binary"
  );
});

test("should not change path for non-Electron apps", () => {
  const path =
    "/Users/artiebits/My.app/Contents/Resources/app.asar/node_modules/foo/binary";

  expect(require("../src/electron-util").fixPathForAsarUnpack(path)).toBe(path);
});
