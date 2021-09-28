export interface Options {
  printer?: string;
  win32?: string[];
  sumatraPdfPath?: string;
}

export interface Printer {
  deviceId: string;
  name: string;
}

export function print(path: string, options?: Options): Promise<void>;

export function getPrinters(): Promise<Printer[]>;

export function getDefaultPrinter(): Promise<Printer | null>;
