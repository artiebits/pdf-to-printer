import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import printer from "pdf-to-printer";
import path from "path";

const pdfUrl = path.join(__static, "/dummy.pdf");

function App() {
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, selectPrinter] = useState(null);

  useEffect(() => {
    printer.getPrinters().then(setPrinters).catch(console.error);
  }, []);

  const onPrinterChangeHandler = (event) => {
    selectPrinter(event.target.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    const options = {};
    if (selectedPrinter) {
      options.printer = selectedPrinter;
    }

    printer.print(pdfUrl, options).then(console.log).catch(console.error);
  };

  const renderPrinter = (printer, index) => {
    return (
      <option key={printer.deviceId + index} value={printer.deviceId}>
        {printer.name}
      </option>
    );
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <fieldset>
        <legend>Electron PDF printing</legend>
        <p>
          <label htmlFor="title">Printers </label>
          <select id="title" name="title" onChange={onPrinterChangeHandler}>
            <option value="" defaultValue="">
              Please choose a printer
            </option>
            {printers.map(renderPrinter)}
          </select>
        </p>

        <p>
          <button type="submit">Print PDF file</button>
        </p>

        <p>
          the PDF is in <code>/static</code> folder.
        </p>
      </fieldset>
    </form>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
