var express = require('express');
var router = express.Router();

let user_controller = require("../controllers/userController");

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('User List is not available to you.');
});



 
module.exports = router;
