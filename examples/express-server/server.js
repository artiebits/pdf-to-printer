const express = require("express");

const print = require("./src/print");
const list = require("./src/list");

const app = express();
app.use(express.json());

app.get("/print", print);

app.get("/list", list);

const port = 8080;

app.listen(port, () => console.log(`http://localhost:${port}.`));
