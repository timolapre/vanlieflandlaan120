var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var sassMiddleware = require("node-sass-middleware");
var schedule = require("node-schedule");
var nodemailer = require("nodemailer");
var hbs = require("hbs");
var sqlite3 = require("sqlite3").verbose();

const monthNames = [
  "Januari",
  "Februari",
  "Maart",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Augustus",
  "September",
  "October",
  "November",
  "December",
];
var week = 0;
var tasks = ["Keuken", "Vloeren", "Apparaten", "Glas & papier", "Trappenhuis"];
var namesDownstairs = ["Lowie", "Ada", "Floris", "Timo", "Andrea"];
var namesDownstairswc = ["Andrea", "Ada", "Lowie", "Floris", "Timo"];
var namesUpstairs = ["Froukje", "Celeste", "Jules", "Heleen", "Maas"];
var namesUpstairswc = ["Maas", "Heleen", "Jules", "Celeste", "Froukje"];
var cleaningScheduleMessage = "";

Number.prototype.mod = function (n) {
  return ((this % n) + n) % n;
};

function getCleanScheduleMessage() {
  week++;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  var message = "Het is weer tijd om schoon te maken!!\n";
  message +=
    "Deadline: " +
    tomorrow.getDate() +
    " " +
    monthNames[tomorrow.getMonth()] +
    "\n\n";
  for (let i = 0; i < tasks.length; i++) {
    if (week % 2 == 0) {
      message +=
        namesDownstairs[i] +
        ": " +
        tasks[(i - week / 2).mod(tasks.length)] +
        "\n";
    } else {
      message +=
        namesUpstairs[i] +
        ": " +
        tasks[(-0.5 + i - week / 2).mod(tasks.length)] +
        "\n";
    }
  }
  message += "\nwc+douche benenden: " + namesDownstairswc[week.mod(5)] + "\n";
  message += "wc+douche boven: " + namesUpstairswc[week.mod(5)] + "\n";
  return message;
}

var j = schedule.scheduleJob("* 18 * * 4", function () {
  cleaningScheduleMessage = getCleanScheduleMessage();

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "memetasticgames@gmail.com",
      pass: "GmailPassword1234",
    },
  });

  var mailOptions = {
    from: "memetasticgames@gmail.com",
    to: "timolapre1998@gmail.com",
    subject: "VLL120 schoonmaakrooster",
    text: cleaningScheduleMessage,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response + " on " + new Date());
    }
  });
});

//DATABASE
var db = new sqlite3.Database(":memory:");

// Insert data into database
db.serialize(function () {
  db.run(
    "CREATE TABLE IF NOT EXISTS huisgenoten (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, naam VARCHAR(255))"
  );
});

var apiRouter = require("./routes/api")(db, cleaningScheduleMessage);
var indexRouter = require("./routes/index");

//EXPRESS
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.set("view options", { layout: "layouts/main.hbs" });

hbs.registerPartials(__dirname + "/views/partials");

app.use("/api", apiRouter);
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
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
