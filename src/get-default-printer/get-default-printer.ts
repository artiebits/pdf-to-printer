import execFileAsync from "../utils/exec-file-async";
import throwIfUnsupportedOperatingSystem from "../utils/throw-if-unsupported-os";
import isValidPrinter from "../utils/windows-printer-valid";

import { defaultProperties, Printer } from "..";

async function getDefaultPrinter(
  properties: typeof defaultProperties = []
): Promise<Printer | null> {
  properties = properties.concat(defaultProperties);

  try {
    throwIfUnsupportedOperatingSystem();

    const props = properties.join(",");

    const { stdout } = await execFileAsync("Powershell.exe", [
      "-Command",
      `Get-CimInstance Win32_Printer -Property ${props} -Filter Default=true`,
    ]);

    const printer = stdout.trim();

    // If stdout is empty, there is no default printer
    if (!stdout) return null;

    const { isValid, printerData } = isValidPrinter(printer, properties);

    // DeviceID or Name not found
    if (!isValid) return null;

    return printerData;
  } catch (error) {
    throw error;
  }
}

export default getDefaultPrinter;
