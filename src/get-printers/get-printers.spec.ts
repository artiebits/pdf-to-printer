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

const mockPrinterListWithPropertiesStdout =
  mockPrinterListStdout +
  `

Status                      : Unknown
Name                        : 4BARCODE 4B
Caption                     : 4BARCODE 4B
DeviceID                    : 4BARCODE 4B
PaperSizesSupported         : {1, 1, 1, 1...}
PortName                    : USB001
PrinterPaperNames           : {USER, 144mm x 100mm, 2 x 4, 4 x 4...}

`;

it("returns list of available printers", async () => {
  mockedExecAsync.mockResolvedValue({
    stdout: mockPrinterListStdout,
    stderr: "",
  });

  const result: Printer[] = await getPrinters();

  expect(result).toStrictEqual([
    { deviceId: "OneNote", name: "OneNote" },
    {
      deviceId: "Microsoft-XPS-Document-Writer",
      name: "Microsoft XPS Document Writer",
    },
    {
      deviceId: "Microsoft_Print_to_PDF",
      name: "Microsoft Print to PDF",
    },
    {
      deviceId: "Fax",
      name: "Fax",
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
  mockedExecAsync.mockResolvedValue({
    stdout: mockPrinterListWithPropertiesStdout,
    stderr: "",
  });

  const result: Printer[] = await getPrinters([
    "deviceId",
    "name",
    "printerPaperNames",
  ]);

  expect(result).toStrictEqual([
    { deviceId: "OneNote", name: "OneNote" },
    {
      deviceId: "Microsoft-XPS-Document-Writer",
      name: "Microsoft XPS Document Writer",
    },
    {
      deviceId: "Microsoft_Print_to_PDF",
      name: "Microsoft Print to PDF",
    },
    {
      deviceId: "Fax",
      name: "Fax",
    },
    {
      deviceId: "4BARCODE 4B",
      name: "4BARCODE 4B",
      printerPaperNames: ["USER", "144mm x 100mm", "2 x 4", "4 x 4"],
    },
  ]);
});
