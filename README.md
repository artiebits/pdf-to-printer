# Node.js PDF printing

[![Build Status](https://api.cirrus-ci.com/github/artiebits/pdf-to-printer.svg)](https://cirrus-ci.com/github/artiebits/pdf-to-printer) 
[![codecov](https://codecov.io/gh/artiebits/pdf-to-printer/branch/master/graph/badge.svg)](https://codecov.io/gh/artiebits/pdf-to-printer)
![npm](https://img.shields.io/npm/dw/pdf-to-printer)


A utility to print PDF files from Node.js and Electron.

* ✅ Works on Windows and Unix-like operating systems.
* ✅ Supports label printers such as [Rollo](https://www.rolloprinter.com/) and [Zebra](https://www.zebra.com/us/en/products/printers.html).

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
import ptp from "pdf-to-printer";

ptp
  .print("assets/pdf-sample.pdf")
  .then(console.log)
  .catch(console.error);
```

## API

### `.print(pdf[, options]) => Promise<void>`

**Arguments**

1. `pdf` (`string`): PDF file to print. Will throw an error if no PDF specified. **Note**: It must be a path to a PDF existing in the file system.
You may take a look at [this example](/examples/express-server) if you need to download your PDF file first.
2. `options` (`Object` [optional]):
   - `options.printer`: (`string` [optional]): Print to the specified printer. Will print to the default printer if name not specified. If the printer name mistyped or specified printer does not exist, nothing will print.
   - `options.unix`: (`array` [optional]):  Since we use **lp** to print documents on Unix-like operating systems you can pass any available in [this list option](https://www.computerhope.com/unix/ulp.htm).
   - `options.win32`: (`array` [optional]): And since we use **SumatraPDF** to print documents on Windows you can pass any available in [this list option](https://www.sumatrapdfreader.org/docs/Command-line-arguments.html).

**Returns**

`Promise<void>`.

**Examples**

To print a PDF file to the default printer:

```javascript
ptp
  .print("assets/pdf-sample.pdf")
  .then(console.log)
  .catch(console.error);
```

To print to a specific printer, add the name of the printer to options:

```javascript
const options = {
  printer: "Zebra"
};

ptp
  .print("assets/pdf-sample.pdf", options)
  .then(console.log)
  .catch(console.error);
```

To scale the PDF to fit into the printable area of the paper on both Windows and Unix operating systems:

```javascript
const options = {
  printer: "Zebra",
  unix: ["-o fit-to-page"],
  win32: ['-print-settings "fit"']
};

ptp
  .print("assets/pdf-sample.pdf", options)
  .then(console.log)
  .catch(console.error);
```

### `.getPrinters() => Promise<string[]>`

**Returns**

`Promise<string[]>`: List of available printers.

**Examples**

```javascript
ptp
  .getPrinters()
  .then(console.log)
  .catch(console.error);
```

### `.getDefaultPrinter() => Promise<string>`

**Returns**

`Promise<string>`: Default printer.

**Examples**

```javascript
ptp
  .getDefaultPrinter()
  .then(console.log)
  .catch(console.error);
```

## More examples

We have a few examples in the [source code](/examples).

## Contact

Please do not hesitate to report a bug or suggest an idea. You can do it [here](https://github.com/artiebits/pdf-to-printer/issues/new/choose).

## Sponsor this project

If you rely on this package please consider supporting it https://www.buymeacoffee.com/artiebits. I would appreciate it.


## License

[MIT](LICENSE)
