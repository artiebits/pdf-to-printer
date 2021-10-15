# Node.js PDF printing

[![Build Status](https://api.cirrus-ci.com/github/artiebits/pdf-to-printer.svg)](https://cirrus-ci.com/github/artiebits/pdf-to-printer)
[![codecov](https://codecov.io/gh/artiebits/pdf-to-printer/branch/master/graph/badge.svg)](https://codecov.io/gh/artiebits/pdf-to-printer)
![npm](https://img.shields.io/npm/dw/pdf-to-printer)

A utility to print PDF files from Node.js and Electron.

- Supports label printers such as [Rollo](https://www.rolloprinter.com/) and [Zebra](https://www.zebra.com/us/en/products/printers.html).
- Works on Windows only.

If you are looking for a utility that will work on **Unix-like operating systems**, then take a look at https://github.com/artiebits/unix-print.

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

### `.print(pdf[, options]) => Promise<void>`

**Arguments**

1. `pdf` (`string`): PDF file to print. Will throw an error if no PDF specified. **Note**: It must be a path to a PDF existing in the file system.
   You may take a look at [this example](/examples/express-server) if you need to download your PDF file first.
2. `options` (`Object` [optional]):
   - `options.printer`: (`string` [optional]): Print to the specified printer. Will print to the default printer if device id not specified. If the printer device id mistyped or specified printer does not exist, nothing will print.
   - `options.win32`: (`array` [optional]): Any available option from [this list](https://www.sumatrapdfreader.org/docs/Command-line-arguments.html).

**Returns**

`Promise<void>`: A promise that resolves with undefined.

**Examples**

To print a PDF file to the default printer:

```javascript
import { print } from "pdf-to-printer";

print("assets/pdf-sample.pdf").then(console.log);
```

To print to a specific printer, add the device id of the printer to options:

```javascript
import { print } from "pdf-to-printer";

const options = {
  printer: "Zebra",
};

print("assets/pdf-sample.pdf", options).then(console.log);
```

To scale the PDF to fit into the printable area of the paper:

```javascript
import { print } from "pdf-to-printer";

const options = {
  printer: "Zebra",
  win32: ['-print-settings "fit"'],
};

print("assets/pdf-sample.pdf", options).then(console.log);
```

### `.getPrinters() => Promise<Printer[]>`

**Returns**

`Promise<Printer[]>`: List of available printers.

**Examples**

```javascript
import { getPrinters } from "pdf-to-printer";

getPrinters().then(console.log);
```

### `.getDefaultPrinter() => Promise<Printer | null>`

**Returns**

`Promise<Printer | null>`: Default printer or `null` if there is no default printer.

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
