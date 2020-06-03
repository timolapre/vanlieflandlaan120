var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'van Lieflandlaan 120' });
});

router.get('/*', function (req, res, next) {
  res.render(req.url.substr(1).split('?')[0], {});
});

module.exports = router;
