"use strict";

import execAsync from "../execAsync";
import getDefaultPrinter from "./get-default-printer";
import getPrinters from "./get-printers";

jest.mock("../../src/execAsync");

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

const mockDefaultPrinterStdout = `
system default destination: EPSON
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
      name: "Virtual_Braille_BRF_Printer",
      displayName: "Virtual Braille BRF Printer",
    },
    {
      name: "Virtual_PDF_Printer",
      displayName: "Virtual PDF Printer",
    },
  ]);
});

test("returns the system default printer", () => {
  execAsync.mockImplementation((_, [], callback) =>
    Promise.resolve(callback(mockDefaultPrinterStdout))
  );
  return expect(getDefaultPrinter()).resolves.toStrictEqual("EPSON");
});

test("fails with an error", () => {
  execAsync.mockImplementation(() => Promise.reject("error"));
  return expect(getPrinters()).rejects.toBe("error");
});
