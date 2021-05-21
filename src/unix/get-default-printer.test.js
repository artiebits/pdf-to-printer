import getDefaultPrinter from "./get-default-printer";
import execAsync from "../utils/exec-async";

jest.mock("../utils/exec-async");

const defaultPrinterStdout = `system default destination: Virtual_PDF_Printer
`;

const defaultPrinterDetailsStdout = `printer Virtual_PDF_Printer is idle.  enabled since Mon 12 Apr 2021 01:35:20 PM EEST
Form mounted:
Content types: any
Printer types: unknown
Description: Virtual PDF Printer
Alerts: none
Location:
Connection: direct
Interface: /etc/cups/ppd/Virtual_PDF_Printer.ppd
`;

afterEach(() => {
  // restore the original implementation.
  execAsync.mockRestore();
});

it("returns the system default printer", async () => {
  execAsync
    .mockImplementationOnce(() =>
      Promise.resolve({ stdout: defaultPrinterStdout })
    )
    .mockImplementationOnce(() =>
      Promise.resolve({ stdout: defaultPrinterDetailsStdout })
    );

  const expected = {
    deviceId: "Virtual_PDF_Printer",
    name: "Virtual PDF Printer",
  };

  await expect(getDefaultPrinter()).resolves.toEqual(expected);
});

it("returns null when default printer is not defined", () => {
  execAsync.mockImplementation(() =>
    Promise.resolve({ stdout: "no system default destination" })
  );

  return expect(getDefaultPrinter()).resolves.toBeNull();
});
