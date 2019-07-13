# Node.js PDF prining

A utility to print PDF files from Node.js apps on Windows and Unix-like platforms.

## Getting Started

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
import printer from "pdf-to-printer";

printer
  .print("assets/pdf-sample.pdf")
  .then(console.log)
  .catch(console.error);
```

## API

### `.print(pdf[, options]) => Promise<void>`

#### Arguments

1. `pdf` (`string`): PDF file to print. Will throw an error if no PDF specified.
2. `options` (`Object` [optional]):
   - `options.printer`: (`Object` [optional]): Print to the specified printer. Will print to the default printer if name not specified. If the printer name mistyped or specified printer does not exist, nothing will print.

#### Returns

`Promise<void>`.

#### Examples

To print a PDF file to the default printer:

```javascript
printer
  .print("assets/pdf-sample.pdf")
  .then(console.log)
  .catch(console.error);
```

To print to a specific printer, add the name of the printer to options:

```javascript
const options = {
  printer: "Zebra"
};

printer
  .print("assets/pdf-sample.pdf", options)
  .then(console.log)
  .catch(console.error);
```

### `.list() => Promise<string[]>`

#### Returns

`Promise<string[]>`: List of available printers.

#### Examples

```javascript
printer
  .list()
  .then(console.log)
  .catch(console.error);
```
