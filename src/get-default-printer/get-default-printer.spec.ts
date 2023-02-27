import { mocked } from "jest-mock";
import getDefaultPrinter from "./get-default-printer";
import execAsync from "../utils/exec-file-async";
import { Printer } from "..";

jest.mock("../utils/throw-if-unsupported-os");
jest.mock("../utils/exec-file-async");
const mockedExecAsync = mocked(execAsync);

const mockDefaultPrinterStdout = `

Status                      :
Name                        : Microsoft Print to PDF
Caption                     :
Description                 :
InstallDate                 :
Availability                :
DeviceID                    : Microsoft Print to PDF
CimClass                    : root/cimv2:Win32_Printer
CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties
`;

it("gets the default printer", async () => {
  mockedExecAsync.mockResolvedValue({
    stdout: mockDefaultPrinterStdout,
    stderr: "",
  });

  const result: Printer | null = await getDefaultPrinter();

  expect(result).toStrictEqual({
    deviceId: "Microsoft Print to PDF",
    name: "Microsoft Print to PDF",
  });
});

it("returns null when default printer is not defined", async () => {
  mockedExecAsync.mockResolvedValue({ stdout: "", stderr: "" });

  const result = await getDefaultPrinter();

  expect(result).toStrictEqual(null);
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

  const result = await getDefaultPrinter();

  return expect(result).toBe(null);
});

it("throws when execAsync fails", () => {
  mockedExecAsync.mockRejectedValue("error");
  return expect(getDefaultPrinter()).rejects.toBe("error");
});

it("gets the default printer with custom and repeated properties", async () => {
  const stdout = `

  Name                        : Microsoft Print to PDF
  Caption                     : Microsoft Print to PDF
  DeviceID                    : Microsoft Print to PDF
  PaperSizesSupported         : {1, 1, 1, 1...}
  PortName                    : USB001
  PrinterPaperNames           : {USER, 144mm x 100mm}
  
  `;

  mockedExecAsync.mockResolvedValue({
    stdout,
    stderr: "",
  });

  const result: Printer | null = await getDefaultPrinter([
    "deviceId",
    "name",
    "printerPaperNames",
    "deviceId",
    "name",
  ]);

  expect(result).toStrictEqual({
    deviceId: "Microsoft Print to PDF",
    name: "Microsoft Print to PDF",
    printerPaperNames: ["USER", "144mm x 100mm"],
  });
});
