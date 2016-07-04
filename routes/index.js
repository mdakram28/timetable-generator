var express = require('express');
var router = express.Router();
var tt,courses,gaps;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.tt = tt;
  res.locals.courses = courses;
  res.locals.gaps = gaps;
  res.render('index', { title: 'Time Table Generator by mdakram28' });
});

module.exports = router;

module.exports.setTimeTables = function(ttt,c,g){
	tt = ttt;
	courses = c;
	gaps = g;
}
