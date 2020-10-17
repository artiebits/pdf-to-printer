export interface Options {
  printer?: string;
  unix?: string[];
  win32?: string[];
}

export function print(path: string, options?: any): Promise<void>;

export function getPrinters(): Promise<string[]>;

export function getDefaultPrinter(): Promise<string>;
