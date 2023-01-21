# Node.js PDF printing

[![Build Status](https://api.cirrus-ci.com/github/artiebits/pdf-to-printer.svg)](https://cirrus-ci.com/github/artiebits/pdf-to-printer)
[![codecov](https://codecov.io/gh/artiebits/pdf-to-printer/branch/master/graph/badge.svg)](https://codecov.io/gh/artiebits/pdf-to-printer)
![npm](https://img.shields.io/npm/dw/pdf-to-printer)

A utility to print PDF files from Node.js and Electron.

- Supports label printers such as [Rollo](https://www.rolloprinter.com/)
  and [Zebra](https://www.zebra.com/us/en/products/printers.html).
- Works on Windows only.

If you are looking for a utility that will work on **Unix-like operating systems**, then take a look
at https://github.com/artiebits/unix-print.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [API](#api)
  - [`.print(pdf[, options]) => Promise<void>`](#printpdf-options--promisevoid)
  - [`.getPrinters() => Promise<Printer[]>`](#getprinters--promiseprinter)
  - [`.getDefaultPrinter() => Promise<Printer | null>`](#getdefaultprinter--promiseprinter--null)
- [Sponsor this project](#sponsor-this-project)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

Install using [`yarn`](https://yarnpkg.com/):

```bash
yarn add pdf-to-printer
```

Or [`npm`](https://www.npmjs.com/):

```bash
npm install --save pdf-to-printer
```

## Basic Usage

Print a PDF file to the default printer:

```javascript
import { print } from "pdf-to-printer";

print("assets/pdf-sample.pdf").then(console.log);
```

## API

A function to print a PDF document.

### `.print(pdf[, options]) => Promise<void>`

**Arguments**

1. `pdf` (`string`, Required): A path to the PDF file you want to print. Will throw an error if PDF not specified or not found.
2. `options` (`Object`, Optional):
   - `printer` ( `string`, Optional): Send a file to the specified printer.
   - `pages` (`string`, Optional): Specifies which pages to print in the PDF document.
   - `subset` (`string`, Optional): Will print odd pages only when value is `odd`. Will print even pages only when `even`.
   - `orientation` (`string`, Optional): Can provide 90-degree rotation of contents (NOT the rotation of paper which must be pre-set by the choice of printer defaults).
   - `scale` (`string`, Optional): Supported names `noscale`, `shrink` and `fit`.
   - `monochrome` (`boolean`, Optional): Prints the document in black and white. Default is `false`.
   - `side` (`string`, Optional): Supported names `duplex`, `duplexshort`, `duplexlong` and `simplex`.
   - `bin` (`string`, Optional): Select tray to print to. Number or name.
   - `paperSize` (`string`, Optional): Specifies the paper size. `A2`, `A3`, `A4`, `A5`, `A6`, `letter`, `legal`, `tabloid`, `statement`, or a name selectable from your printer settings.
   - `silent` (`boolean`, Optional): Silences SumatraPDF's error messages.
   - `printDialog` (`boolean`, Optional): displays the Print dialog for all the files indicated on this command line.
   - `copies`(`number`, Optional): Specifies how many copies will be printed.

**Returns**

`Promise<void>`: a Promise that resolves with undefined.

**Examples**

To print a PDF file to the default printer:

```javascript
import { print } from "pdf-to-printer";

print("assets/pdf-sample.pdf").then(console.log);
```

To print to a specific printer:

```javascript
import { print } from "pdf-to-printer";

const options = {
  printer: "Zebra",
};

print("assets/pdf-sample.pdf", options).then(console.log);
```

Example with a few print settings. It will print pages 1, 3, 5 and scale them so that they fit into the printable area of the paper.

```javascript
import { print } from "pdf-to-printer";

const options = {
  printer: "Zebra",
  pages: "1-3,5",
  scale: "fit",
};

print("assets/pdf-sample.pdf", options).then(console.log);
```

### `.getPrinters() => Promise<Printer[]>`

A function to get a list of available printers.

**Returns**

`Promise<Printer[]>`: a Promise that resolves with a list of available printers.

**Examples**

```javascript
import { getPrinters } from "pdf-to-printer";

getPrinters().then(console.log);
```

### `.getDefaultPrinter() => Promise<Printer | null>`

A function to get the default printer info.

**Returns**

`Promise<Printer | null>`: a Promise that resolves with the default printer info, or `null` if there is no default printer.

**Examples**

```javascript
import { getDefaultPrinter } from "pdf-to-printer";

getDefaultPrinter().then(console.log);
```

## Sponsor this project

If you rely on this package, please consider supporting it:

<a href="https://www.buymeacoffee.com/artiebits" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## License

[MIT](LICENSE)
