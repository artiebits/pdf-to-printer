import execFileAsync from "../utils/exec-file-async";
import isValidPrinter from "../utils/windows-printer-valid";
import throwIfUnsupportedOperatingSystem from "../utils/throw-if-unsupported-os";
import { Printer } from "../get-default-printer/get-default-printer";

async function getPrinters(): Promise<Printer[]> {
  function stdoutHandler(stdout: string) {
    const printers: Printer[] = [];

    stdout
      .split(/(\r?\n){2,}/)
      .map((printer) => printer.trim())
      .filter((printer) => !!printer)
      .forEach((printer) => {
        const { isValid, printerData } = isValidPrinter(printer);

        if (!isValid) return;

        printers.push(printerData);
      });

    return printers;
  }

  try {
    throwIfUnsupportedOperatingSystem();
    const { stdout } = await execFileAsync("Powershell.exe", [
      "-Command",
      "Get-CimInstance Win32_Printer -Property DeviceID,Name",
    ]);
    return stdoutHandler(stdout);
  } catch (error) {
    throw error;
  }
}

export default getPrinters;
