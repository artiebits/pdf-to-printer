import path from "path";
import fs from "fs";
import execAsync from "../utils/exec-file-async";
import fixPathForAsarUnpack from "../utils/electron-util";
import throwIfUnsupportedOperatingSystem from "../utils/throw-if-unsupported-os";
import {
  FileNotFoundError,
  InvalidPdfPathError,
  InvalidPrintOptionError,
  PrintExecutionError,
} from "../types/errors";

/**
 * Configuration options for printing PDFs
 */
export interface PrintOptions {
  printer?: string;
  pages?: string;
  subset?: string;
  orientation?: string;
  scale?: string;
  monochrome?: boolean;
  side?: string;
  bin?: string;
  paperSize?: string;
  silent?: boolean;
  printDialog?: boolean;
  sumatraPdfPath?: string;
  copies?: number;
}

const validSubsets = ["odd", "even"];
const validOrientations = ["portrait", "landscape"];
const validScales = ["noscale", "shrink", "fit"];
const validSides = ["duplex", "duplexshort", "duplexlong", "simplex"];

/**
 * Prints a PDF file to a printer
 *
 * @param pdf - Path to the PDF file to print
 * @param options - Printing configuration options
 * @returns Promise that resolves when printing is complete
 * @throws {Error} If the PDF file doesn't exist or printing fails
 *
 * @example
 * ```typescript
 * // Print to default printer
 * await print("document.pdf");
 *
 * // Print to specific printer with options
 * await print("document.pdf", {
 *   printer: "HP LaserJet",
 *   pages: "1-3",
 *   copies: 2,
 *   paperSize: "A4"
 * });
 * ```
 */
export default async function print(
  pdf: string,
  options: PrintOptions = {},
): Promise<void> {
  throwIfUnsupportedOperatingSystem();
  if (!pdf) throw new InvalidPdfPathError();
  if (!fs.existsSync(pdf)) throw new FileNotFoundError(pdf);

  let sumatraPdf =
    options.sumatraPdfPath || path.join(__dirname, "SumatraPDF-3.4.6-32.exe");
  if (!options.sumatraPdfPath) sumatraPdf = fixPathForAsarUnpack(sumatraPdf);

  const args: string[] = [];

  const { printer, silent, printDialog } = options;

  if (printDialog) {
    args.push("-print-dialog");
  } else {
    if (printer) {
      args.push("-print-to", printer);
    } else {
      args.push("-print-to-default");
    }
    if (silent !== false) {
      args.push("-silent");
    }
  }

  const printSettings = getPrintSettings(options);

  if (printSettings.length) {
    args.push("-print-settings", printSettings.join(","));
  }

  args.push(pdf);

  try {
    await execAsync(sumatraPdf, args);
  } catch (error) {
    throw new PrintExecutionError(error);
  }
}

function getPrintSettings(options: PrintOptions): string[] {
  const {
    pages,
    subset,
    orientation,
    scale,
    monochrome,
    side,
    bin,
    paperSize,
    copies,
  } = options;

  const printSettings = [];

  if (pages) {
    printSettings.push(pages);
  }

  if (subset) {
    if (validSubsets.includes(subset)) {
      printSettings.push(subset);
    } else {
      throw new InvalidPrintOptionError("subset", validSubsets);
    }
  }

  if (orientation) {
    if (validOrientations.includes(orientation)) {
      printSettings.push(orientation);
    } else {
      throw new InvalidPrintOptionError("orientation", validOrientations);
    }
  }

  if (scale) {
    if (validScales.includes(scale)) {
      printSettings.push(scale);
    } else {
      throw new InvalidPrintOptionError("scale", validScales);
    }
  }

  if (monochrome) {
    printSettings.push("monochrome");
  } else if (monochrome === false) {
    printSettings.push("color");
  }

  if (side) {
    if (validSides.includes(side)) {
      printSettings.push(side);
    } else {
      throw new InvalidPrintOptionError("side", validSides);
    }
  }

  if (bin) {
    printSettings.push(`bin=${bin}`);
  }

  if (paperSize) {
    printSettings.push(`paper=${paperSize}`);
  }

  if (copies) {
    printSettings.push(`${copies}x`);
  }

  return printSettings;
}
