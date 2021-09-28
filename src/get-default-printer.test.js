import execAsync from "./utils/exec-file-async";
import getDefaultPrinter from "./get-default-printer";

jest.mock("./utils/exec-file-async");

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
  execAsync.mockImplementation(() =>
    Promise.resolve({ stdout: mockDefaultPrinterStdout })
  );

  const result = await getDefaultPrinter();

  expect(result).toStrictEqual({
    deviceId: "Microsoft Print to PDF",
    name: "Microsoft Print to PDF",
  });
});

test("no default printer defined", async () => {
  execAsync.mockImplementation(() => Promise.resolve({ stdout: "" }));

  const result = await getDefaultPrinter();

  expect(result).toStrictEqual(null);
});
