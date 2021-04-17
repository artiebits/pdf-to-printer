export interface Options {
  printer?: string;
  unix?: string[];
  win32?: string[];
}

export interface PrinterData {
  deviceId: string;
  name: string;
}

export function print(path: string, options?: any): Promise<void>;

export function getPrinters(): Promise<PrinterData[]>;

export function getDefaultPrinter(): Promise<PrinterData> | false;
