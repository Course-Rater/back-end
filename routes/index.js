var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  // MAIN PAGE = search all universities in react

  res.render('index', { title: 'Main Page' });
});

module.exports = router;