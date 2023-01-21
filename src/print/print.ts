import path from "path";
import fs from "fs";
import execAsync from "../utils/exec-file-async";
import fixPathForAsarUnpack from "../utils/electron-util";
import throwIfUnsupportedOperatingSystem from "../utils/throw-if-unsupported-os";

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
const validPaperSizes = [
  "A2",
  "A3",
  "A4",
  "A5",
  "A6",
  "letter",
  "legal",
  "tabloid",
  "statement",
];

export default async function print(
  pdf: string,
  options: PrintOptions = {}
): Promise<void> {
  throwIfUnsupportedOperatingSystem();
  if (!pdf) throw "No PDF specified";
  if (!fs.existsSync(pdf)) throw "No such file";

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
    throw error;
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
      throw `Invalid subset provided. Valid names: ${validSubsets.join(", ")}`;
    }
  }

  if (orientation) {
    if (validOrientations.includes(orientation)) {
      printSettings.push(orientation);
    } else {
      throw `Invalid orientation provided. Valid names: ${validOrientations.join(
        ", "
      )}`;
    }
  }

  if (scale) {
    if (validScales.includes(scale)) {
      printSettings.push(scale);
    } else {
      throw `Invalid scale provided. Valid names: ${validScales.join(", ")}`;
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
      throw `Invalid side provided. Valid names: ${validSides.join(", ")}`;
    }
  }

  if (bin) {
    printSettings.push(`bin=${bin}`);
  }

  if (paperSize) {
    if (validPaperSizes.includes(paperSize)) {
      printSettings.push(`paper=${paperSize}`);
    } else {
      throw `Invalid paper size provided. Valid names: ${validPaperSizes.join(
        ", "
      )}`;
    }
  }

  if (copies) {
    printSettings.push(`${copies}x`);
  }

  return printSettings;
}
