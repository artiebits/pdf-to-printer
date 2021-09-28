import execAsync from "./utils/exec-file-async";
import getPrinters from "./get-printers";

jest.mock("./utils/exec-file-async");

afterEach(() => {
  // restore the original implementation
  execAsync.mockRestore();
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
DeviceID                    : Microsoft XPS Document Writer
CimClass                    : root/cimv2:Win32_Printer
CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties


Status                      :
Name                        : Microsoft Print to PDF
Description                 :
DeviceID                    : Microsoft Print to PDF
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
  execAsync.mockImplementation(() =>
    Promise.resolve({ stdout: mockPrinterListStdout })
  );

  const result = await getPrinters();

  expect(result).toStrictEqual([
    { deviceId: "OneNote", name: "OneNote" },
    {
      deviceId: "Microsoft XPS Document Writer",
      name: "Microsoft XPS Document Writer",
    },
    {
      deviceId: "Microsoft Print to PDF",
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
  execAsync.mockImplementation(() => Promise.resolve({ stdout }));

  const result = await getPrinters();

  return expect(result).toEqual([]);
});

it("fails with an error", () => {
  execAsync.mockImplementation(() => Promise.reject("error"));
  return expect(getPrinters()).rejects.toBe("error");
});
