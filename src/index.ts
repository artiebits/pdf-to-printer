export { default as print } from "./print/print";
export { default as getPrinters } from "./get-printers/get-printers";
export { default as getDefaultPrinter } from "./get-default-printer/get-default-printer";
import os from "os";

if (os.platform() !== "win32") {
  throw new Error("Platform not supported");
}
