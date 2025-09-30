import execFileAsync from "../utils/exec-file-async";
import isValidPrinter from "../utils/windows-printer-valid";
import throwIfUnsupportedOperatingSystem from "../utils/throw-if-unsupported-os";
import { Printer } from "..";

/**
 * Gets a list of all available printers on the system
 *
 * @returns Promise that resolves to an array of printer objects
 * @throws {Error} If the operating system is not supported or if the command fails
 *
 * @example
 * ```typescript
 * const printers = await getPrinters();
 * console.log(printers);
 * // [
 * //   { deviceId: "HP_LaserJet", name: "HP LaserJet Pro", paperSizes: ["A4", "Letter"] },
 * //   { deviceId: "Canon_Pixma", name: "Canon PIXMA", paperSizes: ["A4", "A3"] }
 * // ]
 * ```
 */
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
      `Get-CimInstance Win32_Printer -Property DeviceID,Name,PrinterPaperNames`,
    ]);
    return stdoutHandler(stdout);
  } catch (error) {
    throw error;
  }
}

export default getPrinters;
