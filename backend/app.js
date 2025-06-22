const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const userRoutes = require("./routes/user");
const taskRoutes = require("./routes/task");
const environment = require("./environments/environment");

mongoose
  .connect("mongodb://localhost:27017/dytt")
  .then(() => {
    console.log("LOG:[app](app.use): connected to database");
  })
  .catch(() => {
    console.log("LOG:[app](app.use): connection to database failed");
  });

app.use((request, response, next) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    environment.production
      ? environment.frontendUrl
      : environment.dev_frontendUrl
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);

module.exports = app;
