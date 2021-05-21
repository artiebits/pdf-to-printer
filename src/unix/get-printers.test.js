"use strict";

import execAsync from "../exec-async";
import getDefaultPrinter from "./get-default-printer";
import getPrinters from "./get-printers";

jest.mock("../../src/exec-async");

const mockPrinterListStdout = `printer Virtual_Braille_BRF_Printer is idle.  enabled since Tue 30 Mar 2021 11:54:05 PM EEST
Form mounted:
Content types: any
Printer types: unknown
Description: Virtual Braille BRF Printer
Alerts: none
Location:
Connection: direct
Interface: /etc/cups/ppd/Virtual_Braille_BRF_Printer.ppd
On fault: no alert
After fault: continue
Users allowed:
        (all)
Forms allowed:
        (none)
Banner required
Charset sets:
        (none)
Default pitch:
Default page size:
Default port settings:
printer Virtual_PDF_Printer is idle.  enabled since Tue 09 Feb 2021 12:32:35 AM EET
Form mounted:
Content types: any
Printer types: unknown
Description: Virtual PDF Printer
Alerts: none
Location:
Connection: direct
Interface: /etc/cups/ppd/Virtual_PDF_Printer.ppd
On fault: no alert
After fault: continue
Users allowed:
        (all)
Forms allowed:
        (none)
Banner required
Charset sets:
        (none)
Default pitch:
Default page size:
Default port settings:
`;

const mockDefaultPrinterStdout = `system default destination: Virtual_PDF_Printer
`;

const mockDefaultPrinterDataStdout = `printer Virtual_PDF_Printer is idle.  enabled since Mon 12 Apr 2021 01:35:20 PM EEST
Form mounted:
Content types: any
Printer types: unknown
Description: Virtual PDF Printer
Alerts: none
Location:
Connection: direct
Interface: /etc/cups/ppd/Virtual_PDF_Printer.ppd
On fault: no alert
After fault: continue
Users allowed:
        (all)
Forms allowed:
        (none)
Banner required
Charset sets:
        (none)
Default pitch:
Default page size:
Default port settings:
`;

afterEach(() => {
  // restore the original implementation
  execAsync.mockRestore();
});

test("returns list of available printers", () => {
  execAsync.mockImplementation((_, [], callback) =>
    Promise.resolve(callback(mockPrinterListStdout))
  );

  return expect(getPrinters()).resolves.toStrictEqual([
    {
      deviceId: "Virtual_Braille_BRF_Printer",
      name: "Virtual Braille BRF Printer",
    },
    {
      deviceId: "Virtual_PDF_Printer",
      name: "Virtual PDF Printer",
    },
  ]);
});

test("returns the system default printer", () => {
  execAsync
    .mockImplementationOnce((_, [], callback) =>
      Promise.resolve(callback(mockDefaultPrinterStdout))
    )
    .mockImplementationOnce((_, [], callback) =>
      Promise.resolve(callback(mockDefaultPrinterDataStdout))
    );

  return expect(getDefaultPrinter()).resolves.toStrictEqual({
    deviceId: "Virtual_PDF_Printer",
    name: "Virtual PDF Printer",
  });
});

test("test no default printer defined", () => {
  execAsync.mockImplementation((_, [], callback) =>
    Promise.resolve(callback("no system default destination"))
  );

  return expect(getDefaultPrinter()).resolves.toStrictEqual(false);
});

test("fails with an error", () => {
  execAsync.mockImplementation(() => Promise.reject("error"));

  return expect(getPrinters()).rejects.toBe("error");
});
