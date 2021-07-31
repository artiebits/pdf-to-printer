import getPrinters from "./get-printers";
import execAsync from "../utils/exec-async";

jest.mock("../utils/exec-async");

const stdout = `printer Virtual_PDF_Printer is idle.  enabled since Tue 30 Mar 2021 11:54:05 PM EEST
The printer configuration is incorrect or the printer no longer exists
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
printer Zebra is idle.  enabled since Tue 09 Feb 2021 12:32:35 AM EET
The printer configuration is incorrect or the printer no longer exists
Form mounted:
Content types: any
Printer types: unknown
Description: Zebra Printer
Alerts: none
Location:
Connection: direct
Interface: /etc/cups/ppd/Zebra_Printer.ppd
On fault: no alert
After fault: continue
`;

afterEach(() => {
  // restore the original implementation.
  execAsync.mockRestore();
});

it("list of available printers", async () => {
  execAsync.mockImplementation(() => Promise.resolve({ stdout }));

  const expected = [
    {
      deviceId: "Virtual_PDF_Printer",
      name: "Virtual PDF Printer",
    },
    {
      deviceId: "Zebra",
      name: "Zebra Printer",
    },
  ];

  await expect(getPrinters()).resolves.toEqual(expected);
});

it("fails with an error", async () => {
  execAsync.mockImplementation(() => Promise.reject("error"));
  await expect(getPrinters()).rejects.toMatch("error");
});
