const fs = require("fs");
const path = require("path");
const printer = require("pdf-to-printer");
const fetch = require("node-fetch");

function print(request, response) {
  function onSuccess() {
    response.send({ status: "completed" });
  }

  function onError(error) {
    response.send({ status: "error", error });
  }

  fetch(request.query.url)
    .then((res) => res.buffer())
    .then((buffer) => {
      const pdf = save(buffer);

      printer
        .print(pdf)
        .then(onSuccess)
        .catch(onError)
        .finally(() => remove(pdf));
    });
}

function save(buffer) {
  const pdfPath = path.join(__dirname, randomString() + ".pdf");
  fs.writeFileSync(pdfPath, buffer, "binary");
  return pdfPath;
}

function remove(pdf) {
  fs.unlinkSync(pdf);
}

function randomString() {
  return Math.random().toString(36).substring(7);
}

module.exports = print;
