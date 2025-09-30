import execFileAsync from "../utils/exec-file-async";
import throwIfUnsupportedOperatingSystem from "../utils/throw-if-unsupported-os";
import isValidPrinter from "../utils/windows-printer-valid";
import { Printer } from "..";

/**
 * Gets the default printer information
 *
 * @returns Promise that resolves to the default printer object, or null if no default printer is set
 * @throws {Error} If the operating system is not supported or if the command fails
 *
 * @example
 * ```typescript
 * const defaultPrinter = await getDefaultPrinter();
 * if (defaultPrinter) {
 *   console.log(`Default printer: ${defaultPrinter.name}`);
 *   console.log(`Device ID: ${defaultPrinter.deviceId}`);
 *   console.log(`Paper sizes: ${defaultPrinter.paperSizes.join(", ")}`);
 * } else {
 *   console.log("No default printer set");
 * }
 * ```
 */
async function getDefaultPrinter(): Promise<Printer | null> {
  try {
    throwIfUnsupportedOperatingSystem();

    const { stdout } = await execFileAsync("Powershell.exe", [
      "-Command",
      `Get-CimInstance Win32_Printer -Property DeviceID,Name,PrinterPaperNames -Filter Default=true`,
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
