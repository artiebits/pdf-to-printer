const printer = require("pdf-to-printer");

function list(request, response) {
  function onSuccess(data) {
    response.send({ data });
  }

  function onError(error) {
    response.send({ status: "error", error });
  }

  printer
    .list()
    .then(onSuccess)
    .catch(onError);
}

module.exports = list;
