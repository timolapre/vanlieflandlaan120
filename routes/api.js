module.exports = function (db) {
  var express = require("express");
  var router = express.Router();

  /* GET home page. */
  router.get("/", function (req, res, next) {
    res.send("Alive");
  });

  router.post("/cleaning", function (req, res, next) {
    if(req.body.weekOffset){
      week += parseInt(req.body.weekOffset);
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
var week = 1;
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
  const today = new Date();
  const tomorrow = new Date("6-8-2020");
  tomorrow.setDate(tomorrow.getDate() + (week-1)*7);
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
