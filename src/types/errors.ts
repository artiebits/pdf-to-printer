/**
 * Base error class for pdf-to-printer operations
 */
export abstract class PdfToPrinterError extends Error {
  abstract readonly code: string;

  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Error thrown when the operating system is not supported
 */
export class UnsupportedOperatingSystemError extends PdfToPrinterError {
  readonly code = "UNSUPPORTED_OS";

  constructor() {
    super(
      "Operating System not supported. This package only works on Windows.",
    );
  }
}

/**
 * Error thrown when a PDF file is not found
 */
export class FileNotFoundError extends PdfToPrinterError {
  readonly code = "FILE_NOT_FOUND";

  constructor(public readonly filePath: string) {
    super(`No such file: ${filePath}`);
  }
}

/**
 * Error thrown when no PDF path is specified
 */
export class InvalidPdfPathError extends PdfToPrinterError {
  readonly code = "INVALID_PDF_PATH";

  constructor() {
    super("No PDF specified");
  }
}

/**
 * Error thrown when an invalid print option is provided
 */
export class InvalidPrintOptionError extends PdfToPrinterError {
  readonly code = "INVALID_PRINT_OPTION";

  constructor(
    public readonly option: string,
    public readonly validOptions: readonly string[],
  ) {
    super(
      `Invalid ${option} provided. Valid names: ${validOptions.join(", ")}`,
    );
  }
}

/**
 * Error thrown when print execution fails
 */
export class PrintExecutionError extends PdfToPrinterError {
  readonly code = "PRINT_EXECUTION_FAILED";

  constructor(originalError: unknown) {
    super(`Print execution failed: ${originalError}`, originalError);
  }
}

/**
 * Error thrown when printer not found
 */
export class PrinterNotFoundError extends PdfToPrinterError {
  readonly code = "PRINTER_NOT_FOUND";

  constructor(originalError: unknown) {
    super(`Failed to find printers: ${originalError}`, originalError);
  }
}
