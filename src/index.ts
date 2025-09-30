export { default as print } from "./print/print";
export { default as getPrinters } from "./get-printers/get-printers";
export { default as getDefaultPrinter } from "./get-default-printer/get-default-printer";
export { PrintOptions } from "./print/print";

/**
 * Represents a printer device
 */
export type Printer = {
  /** Unique identifier for the printer device */
  deviceId: string;
  /** Human-readable name of the printer */
  name: string;
  /** Array of supported paper sizes */
  paperSizes: string[];
};
