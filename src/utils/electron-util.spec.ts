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
      ...originalProcess.versions,
      electron: "0.0.0",
    },
    // @ts-ignore
    mainModule: {
      filename: "/app.asar/index.html",
    },
  };

  const fixPathForAsarUnpack = require("./electron-util").default;

  expect(fixPathForAsarUnpack(path)).toBe(
    "/Users/artiebits/My.app/Contents/Resources/app.asar.unpacked/node_modules/foo/binary"
  );
});

test("should not change path for non-Electron apps", () => {
  const path =
    "/Users/artiebits/My.app/Contents/Resources/app.asar/node_modules/foo/binary";

  const fixPathForAsarUnpack = require("./electron-util").default;

  expect(fixPathForAsarUnpack(path)).toBe(path);
});
