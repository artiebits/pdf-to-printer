import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import printer from "pdf-to-printer";
import path from "path";
import { ipcRenderer } from 'electron'

const pdfUrl = path.join(__static, "/dummy.pdf");

function App() {
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, selectPrinter] = useState(null);

  useEffect(() => {
    console.log('useEffect');
    printer
      .getPrinters()
      .then(setPrinters)
      .catch(console.error);

    ipcRenderer.on('exec_print', (event, params) => {
      const { execPath,selectedPrinter } = params
      console.log('execPath=' + execPath + ",pdfUrl=" + pdfUrl);
      execPrint(execPath, selectedPrinter)
    })
  }, []);

  const execPrint = (execPath, selectedPrinter) => {
    console.log('selectedPrinter=' + selectedPrinter);
    if (selectedPrinter) {
      const options = {}
      options.printer = selectedPrinter
      options.path = execPath
      printer
        .print(pdfUrl, options)
        .then(console.log)
        .catch(console.error);
    }
  }

  const onPrinterChangeHandler = event => {
    selectPrinter(event.target.value);
  };

  const onSubmitHandler = event => {
    event.preventDefault();

    const options = {};
    if (selectedPrinter) {
      options.printer = selectedPrinter;
    }

    printer
      .print(pdfUrl, options)
      .then(console.log)
      .catch(console.error);
  };

  const sendPrintEvent = (event) => {
    event.preventDefault()
    ipcRenderer.send('print_event', selectedPrinter)
  };

  const renderPrinter = (printer, index) => {
    return (
      <option key={printer + index} value={printer}>
        {printer}
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
          <button onClick={sendPrintEvent}>Other Print</button>
        </p>
        <p>
          the PDF is in <code>/static</code> folder.
        </p>
      </fieldset>
    </form>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
