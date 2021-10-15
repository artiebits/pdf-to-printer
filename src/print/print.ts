import path from "path";
import fs from "fs";
import splitArgs from "../utils/split-args";
import execAsync from "../utils/exec-file-async";
import fixPathForAsarUnpack from "../utils/electron-util";

export interface PrintOptions {
  printer?: string;
  win32?: string[];
  sumatraPdfPath?: string;
}

const validDestinationArgs = [
  "-print-to",
  "-print-to-default",
  "-print-dialog",
];

export default async function print(
  pdf: string,
  options: PrintOptions = {}
): Promise<void> {
  if (!pdf) throw "No PDF specified";
  if (typeof pdf !== "string") throw "Invalid PDF name";
  if (!fs.existsSync(pdf)) throw "No such file";

  let sumatraPdf =
    options.sumatraPdfPath || path.join(__dirname, "SumatraPDF.exe");
  if (!options.sumatraPdfPath) sumatraPdf = fixPathForAsarUnpack(sumatraPdf);

  const args: string[] = [];

  const { printer, win32 } = options;

  if (win32) {
    if (!Array.isArray(win32)) throw "options.win32 should be an array";
    win32
      .map(splitArgs)
      .reduce((acc, arg) => acc.concat(arg), [])
      .forEach((arg) => args.push(arg));
  }

  let validDestination = false;
  args.some((a) => {
    const fullMatch = validDestinationArgs.indexOf(a) > -1;
    if (fullMatch) {
      validDestination = true;
      return true;
    } else {
      return false;
    }
  });

  if (!validDestination) {
    if (printer) {
      args.push("-print-to", printer);
    } else {
      args.push("-print-to-default");
    }
    args.push("-silent");
  }

  args.push(pdf);

  try {
    await execAsync(sumatraPdf, args);
  } catch (error) {
    throw error;
  }
}
