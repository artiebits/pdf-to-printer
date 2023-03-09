import execFileAsync from "../utils/exec-file-async";
import throwIfUnsupportedOperatingSystem from "../utils/throw-if-unsupported-os";
import isValidPrinter from "../utils/windows-printer-valid";
import { Printer } from "..";

async function getDefaultPrinter(): Promise<Printer | null> {
  try {
    throwIfUnsupportedOperatingSystem();

    const { stdout } = await execFileAsync("Powershell.exe", [
      "-Command",
      `Get-CimInstance Win32_Printer -Property Status,DeviceID,Name,PrinterPaperNames -Filter Default=true`,
    ]);

    const printer = stdout.trim();

    // If stdout is empty, there is no default printer
    if (!stdout) return null;

    const { isValid, printerData } = isValidPrinter(printer);

    // DeviceID or Name not found
    if (!isValid) return null;

    return printerData;
  } catch (error) {
    throw error;
  }
}

export default getDefaultPrinter;
