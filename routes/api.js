module.exports = function (db, cleaningScheduleMessage) {
  var express = require("express");
  var router = express.Router();

  /* GET home page. */
  router.get("/", function (req, res, next) {
    res.send("Alive");
  });

  router.get("/cleaning", function (req, res, next) {
    if (cleaningScheduleMessage) {
      res.send(cleaningScheduleMessage.split("\n").join("</br>"));
    } else {
      res.send("Vanaf zondag beschikbaar");
    }
  });

  return router;
};
