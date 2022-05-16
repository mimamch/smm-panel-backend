var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const cors = require("cors");
var app = express();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);

app.use(
  cors({
    credentials: true,
    origin: true,
    optionsSuccessStatus: 200,
  })
);
app.use(function (req, res, next) {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

if (process.env.NODE_ENV == "development") {
  app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const routes = require("./app/routes");
const routes2 = require("./v2/");
app.use("/api/v1", routes);
app.use("/api/v2", routes2);

var cron = require("node-cron");
const { updateDatabase, getServicesAPI } = require("./v2/tools");
const { updateStatus } = require("./v2/tools");

cron.schedule(" 59 1 * * *", async () => {
  const isUpdated = await updateDatabase();
  if (!isUpdated) return console.log("Fail Update Database");
  return console.log("Database Updated");
});
cron.schedule(" 0,30 * * * *", async () => {
  const isUpdated = await updateStatus();
  if (!isUpdated) return console.log("Fail Update Status");
  return console.log("Status Updated");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return res.redirect("https://smm.mimamch.online");
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
