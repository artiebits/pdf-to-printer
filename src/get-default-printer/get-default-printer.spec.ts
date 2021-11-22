import { mocked } from "ts-jest/utils";
import getDefaultPrinter from "./get-default-printer";
import execAsync from "../utils/exec-file-async";

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

  const result = await getDefaultPrinter();

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
