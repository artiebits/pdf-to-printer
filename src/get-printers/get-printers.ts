import execFileAsync from "../utils/exec-file-async";
import isValidPrinter from "../utils/windows-printer-valid";
import throwIfUnsupportedOperatingSystem from "../utils/throw-if-unsupported-os";

import { defaultProperties, Printer } from "..";

async function getPrinters(
  properties: typeof defaultProperties = []
): Promise<Printer[]> {
  properties = properties.concat(defaultProperties);

  function stdoutHandler(stdout: string) {
    const printers: Printer[] = [];

    stdout
      .split(/(\r?\n){2,}/)
      .map((printer) => printer.trim())
      .filter((printer) => !!printer)
      .forEach((printer) => {
        const { isValid, printerData } = isValidPrinter(printer, properties);

        if (!isValid) return;

        printers.push(printerData);
      });

    return printers;
  }

  const props = properties.join(",");

  try {
    throwIfUnsupportedOperatingSystem();
    const { stdout } = await execFileAsync("Powershell.exe", [
      "-Command",
      `Get-CimInstance Win32_Printer -Property ${props}`,
    ]);
    return stdoutHandler(stdout);
  } catch (error) {
    throw error;
  }
}

export default getPrinters;
