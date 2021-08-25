export interface Options {
  printer?: string;
  unix?: string[];
  win32?: string[];
  sumatraPdfPath?: string;
}

export interface Printer {
  deviceId: string;
  name: string;
}

export interface JobId extends String {}

declare enum JobStatus {
  Outdated = "outdated",
  Completed = "completed",
}

export function print(path: string, options?: Options): Promise<JobId>;

export function getPrinters(): Promise<Printer[]>;

export function getDefaultPrinter(): Promise<Printer> | false;

export function observe(
  jobId: JobId,
  timeout?: number,
  delay?: number,
  options?: Options
): Promise<JobStatus>;
