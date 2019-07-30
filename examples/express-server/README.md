# express-server

Run the example:

```bash
git clone https://github.com/artiebits/pdf-to-printer.git

cd pdf-to-printer/examples/express-server
npm install
npm run start
```

It will start a server on [http://localhost:8080](http://localhost:5000).
* Open [/list](http://localhost:5000/list) in a browser to retrieve a list of printers.
* Open [/print](http://localhost:8080/print?url=https://easypost-files.s3-us-west-2.amazonaws.com/files/postage_label/20190716/15ad63c69e654e228d92a1ee0aa9d536.pdf) to send the specified in the query string PDF file to the default printer.
