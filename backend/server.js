const debug = require("debug")("dytt");
const http = require("http");

const app = require("./app");

const normalizePort = (val) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    console.log("LOG:[server.js](normalizePort): port = " + val);
    return val;
  }

  if (port >= 0) {
    console.log("LOG:[server.js](normalizePort): port = " + port);
    return port;
  }

  console.log("LOG:[server.js](normalizePort): port = false");
  return false;
};

const onError = (error) => {
  if (error.syscall !== "listen") {
    console.log("ERROR:[server.js](onError): syscall is not listen");
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.log(
        "ERROR:[server](onError): " + bind + " requires elevated privileges"
      );
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.log("ERROR:[server](onError): " + bind + " is already in use");
      process.exit(1);
      break;
    default:
      console.log("ERROR:[server](onError): error " + error);
      throw error;
  }
};

const onListening = () => {
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
  console.log("LOG:[server](onListening): listening on " + bind);
};

const port = normalizePort(3000);
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
