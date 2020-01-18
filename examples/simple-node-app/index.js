const printer = require("pdf-to-printer");

function print(pdf) {
  printer
    .print(pdf)
    .then(console.log)
    .catch(console.error);
}

print("dummy.pdf");
