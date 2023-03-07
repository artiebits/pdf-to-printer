import { mocked } from "jest-mock";
import { Printer } from "..";
import execAsync from "../utils/exec-file-async";
import getPrinters from "./get-printers";

jest.mock("../utils/throw-if-unsupported-os");
jest.mock("../utils/exec-file-async");
const mockedExecAsync = mocked(execAsync);

afterEach(() => {
  // restore the original implementation
  mockedExecAsync.mockRestore();
});

const mockPrinterListStdout = `

Status                      :
Name                        : OneNote
Caption                     :
Description                 :
InstallDate                 :
DeviceID                    : OneNote
StartTime                   :
UntilTime                   :
WorkOffline                 :
PSComputerName              :
CimClass                    : root/cimv2:Win32_Printer
CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties


Status                      :
Name                        : Microsoft XPS Document Writer
Caption                     :
Description                 :
InstallDate                 :
Availability                :
DeviceID                    : Microsoft-XPS-Document-Writer
CimClass                    : root/cimv2:Win32_Printer
CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties


Status                      :
Name                        : Microsoft Print to PDF
Description                 :
DeviceID                    : Microsoft_Print_to_PDF
CimClass                    : root/cimv2:Win32_Printer
CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties


Status                      :
Name                        : Fax
Description                 :
InstallDate                 :
DeviceID                    : Fax
CimClass                    : root/cimv2:Win32_Printer
CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties

`;

it("returns list of available printers", async () => {
  mockedExecAsync.mockResolvedValue({
    stdout: mockPrinterListStdout,
    stderr: "",
  });

  const result: Printer[] = await getPrinters();

  expect(result).toStrictEqual([
    { deviceId: "OneNote", name: "OneNote", paperSizes: [] },
    {
      deviceId: "Microsoft-XPS-Document-Writer",
      name: "Microsoft XPS Document Writer",
      paperSizes: [],
    },
    {
      deviceId: "Microsoft_Print_to_PDF",
      name: "Microsoft Print to PDF",
      paperSizes: [],
    },
    {
      deviceId: "Fax",
      name: "Fax",
      paperSizes: [],
    },
  ]);
});

it("when did not find any printer info", async () => {
  const stdout = `
  Status                      :
  Caption                     :
  Description                 :
  InstallDate                 :
  Availability                :
  CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties
  `;
  mockedExecAsync.mockResolvedValue({ stdout, stderr: "" });

  const result = await getPrinters();

  return expect(result).toEqual([]);
});

it("fails with an error", () => {
  mockedExecAsync.mockRejectedValue("error");
  return expect(getPrinters()).rejects.toBe("error");
});

it("returns list of available printers with custom properties", async () => {
  const stdout = `

  Status                      : Unknown
  Name                        : Canon Printer
  Caption                     : Canon Printer
  DeviceID                    : Canon-Printer
  PaperSizesSupported         : {1, 1, 1, 1...}
  PortName                    : USB001
  PrinterPaperNames           : {A4, 144mm x 100mm, 2 x 4, 4 x 4...}
  
  `;

  mockedExecAsync.mockResolvedValue({
    stdout,
    stderr: "",
  });

  const result: Printer[] = await getPrinters();

  expect(result).toStrictEqual([
    {
      deviceId: "Canon-Printer",
      name: "Canon Printer",
      paperSizes: ["A4", "144mm x 100mm", "2 x 4", "4 x 4"],
    },
  ]);
});
