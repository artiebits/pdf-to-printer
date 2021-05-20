export interface Options {
  printer?: string;
  unix?: string[];
  win32?: string[];
}

export interface PrinterData {
  deviceId: string;
  name: string;
}

export interface JobId extends String {}

declare enum JobStatus {
  Outdated = "outdated",
  Completed = "completed",
}

export function print(path: string, options?: Options): Promise<JobId>;

export function getPrinters(): Promise<PrinterData[]>;

export function getDefaultPrinter(): Promise<PrinterData> | false;

export function observe(
  jobId: JobId,
  timeout?: number,
  delay?: number,
  options?: Options
): Promise<JobStatus>;
