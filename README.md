# PDF to Printer

[![codecov](https://codecov.io/gh/artiebits/pdf-to-printer/branch/master/graph/badge.svg)](https://codecov.io/gh/artiebits/pdf-to-printer)
![npm](https://img.shields.io/npm/dw/pdf-to-printer)

A powerful Node.js and Electron utility for printing PDFs and images to Windows printers.

## Features

- **Print PDFs and images** to any Windows printer
- **Precise control** over printing options (pages, orientation, paper size, etc.)
- **Label printer support** (Rollo, Zebra, and more)
- **Printer discovery** - list all available printers
- **Fast and reliable** using SumatraPDF engine
- **TypeScript support** with full type definitions
- **Windows only** - for Unix-like systems, see [unix-print](https://github.com/artiebits/unix-print)

## Installation

```bash
npm install pdf-to-printer
# or
yarn add pdf-to-printer
```

## Quick Start

```typescript
import { print, getPrinters, getDefaultPrinter } from "pdf-to-printer";

// Print to default printer
await print("document.pdf");

// Print with options
await print("document.pdf", {
  printer: "HP LaserJet",
  pages: "1-3",
  copies: 2,
  paperSize: "A4",
});

// List available printers
const printers = await getPrinters();
console.log(printers);

// Get default printer
const defaultPrinter = await getDefaultPrinter();
console.log(defaultPrinter?.name);
```

## Support This Project

If you rely on this package, please consider supporting it. Maintaining an open source project takes time and your support would be greatly appreciated.

<a href="https://www.buymeacoffee.com/artiebits" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 50px !important;width: 207px !important;" ></a>

## API Reference

### `print(pdf, options?)`

Prints a PDF file to a printer.

**Parameters:**

- `pdf` (string): Path to the PDF file to print
- `options` (PrintOptions, optional): Printing configuration options

**Returns:** `Promise<void>`

**Throws:** `Error` if the PDF file doesn't exist, the operating system is not supported, or printing fails

#### PrintOptions

| Option           | Type                                                     | Description                                                  |
| ---------------- | -------------------------------------------------------- | ------------------------------------------------------------ |
| `printer`        | `string`                                                 | Name of the printer to use (default: system default printer) |
| `pages`          | `string`                                                 | Pages to print (e.g., "1-3,5" or "1,3,5")                    |
| `subset`         | `"odd" \| "even"`                                        | Print only odd or even pages                                 |
| `orientation`    | `"portrait" \| "landscape"`                              | Page orientation                                             |
| `scale`          | `"noscale" \| "shrink" \| "fit"`                         | Content scaling                                              |
| `monochrome`     | `boolean`                                                | Print in black and white                                     |
| `side`           | `"duplex" \| "duplexshort" \| "duplexlong" \| "simplex"` | Duplex printing                                              |
| `bin`            | `string`                                                 | Paper tray/bin to use (number or name)                       |
| `paperSize`      | `string`                                                 | Paper size (e.g., "A4", "letter", "legal")                   |
| `silent`         | `boolean`                                                | Suppress error messages                                      |
| `printDialog`    | `boolean`                                                | Show print dialog instead of printing directly               |
| `sumatraPdfPath` | `string`                                                 | Custom path to SumatraPDF executable                         |
| `copies`         | `number`                                                 | Number of copies to print (default: 1)                       |

### `getPrinters()`

Gets a list of all available printers on the system.

**Returns:** `Promise<Printer[]>`

**Throws:** `Error` if the operating system is not supported or if the command fails

**Example:**

```typescript
import { getPrinters } from "pdf-to-printer";

const printers = await getPrinters();
console.log(printers);
// [
//   { deviceId: "HP_LaserJet", name: "HP LaserJet Pro", paperSizes: ["A4", "Letter"] },
//   { deviceId: "Canon_Pixma", name: "Canon PIXMA", paperSizes: ["A4", "A3"] }
// ]
```

### `getDefaultPrinter()`

Gets the default printer information.

**Returns:** `Promise<Printer | null>`

**Throws:** `Error` if the operating system is not supported or if the command fails

**Example:**

```typescript
import { getDefaultPrinter } from "pdf-to-printer";

const defaultPrinter = await getDefaultPrinter();
if (defaultPrinter) {
  console.log(`Default printer: ${defaultPrinter.name}`);
  console.log(`Device ID: ${defaultPrinter.deviceId}`);
  console.log(`Paper sizes: ${defaultPrinter.paperSizes.join(", ")}`);
} else {
  console.log("No default printer set");
}
```

### `Printer` Type

```typescript
type Printer = {
  deviceId: string; // Unique identifier for the printer device
  name: string; // Human-readable name of the printer
  paperSizes: string[]; // Array of supported paper sizes
};
```

## License

[MIT](LICENSE)
