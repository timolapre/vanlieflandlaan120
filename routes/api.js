module.exports = function (db) {
  var express = require("express");
  var router = express.Router();

  /* GET home page. */
  router.get("/", function (req, res, next) {
    res.send("Alive");
  });

  router.post("/cleaning", function (req, res, next) {
    console.log(req.body)
    if (req.body.today == 'false') {
      if (req.body.weekOffset) {
        console.log(typeof req.body.weekOffset);
        week += parseInt(req.body.weekOffset);
      }
    } else if (req.body.today == 'true') {
      var originalDate = new Date("6-8-2020");
      var nextMonday = new Date();
      nextMonday.setDate(nextMonday.getDate() + (1 + 7 - nextMonday.getDay()) % 7);
      var weeks = Math.round((nextMonday - originalDate) / 604800000);
      week = weeks + 1;
    }
    res.send(getCleanScheduleMessage().split("\n").join("</br>"));
  });

  return router;
};

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
var week = 24;
var tasks = ["Keuken", "Vloeren", "Apparaten", "Glas & papier", "Trappenhuis"];
var namesDownstairs = ["Lowie", "Caitlin", "Floris", "Timo", "Andrea"];
var namesDownstairswc = ["Caitlin", "Andrea", "Lowie", "Floris", "Timo"];
var namesUpstairs = ["Froukje", "Megan", "Marijn", "Ada", "Maas"];
var namesUpstairswc = ["Maas", "Megan", "Ada", "Froukje", "Marijn"];
var cleaningScheduleMessage = "";

Number.prototype.mod = function (n) {
  return ((this % n) + n) % n;
};

function getCleanScheduleMessage() {
  var tomorrow = new Date("6-8-2020");
  tomorrow.setDate(tomorrow.getDate() + (week - 1) * 7);
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
  message += "\nwc+douche benenden: " + namesDownstairswc[parseInt(week).mod(5)] + "\n";
  message += "wc+douche boven: " + namesUpstairswc[parseInt(week).mod(5)] + "\n";
  return message;
}

console.log(getCleanScheduleMessage());