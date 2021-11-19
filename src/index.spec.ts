jest.mock("os");

test("has `print`, `getDefaultPrinter` and `getPrinters` methods", () => {
  jest.resetModules();

  const os = require("os");
  os.platform.mockImplementation(() => "win32");

  const printer = require("./index");

  expect(printer.print).toBeDefined();
  expect(printer.getDefaultPrinter).toBeDefined();
  expect(printer.getPrinters).toBeDefined();
});
