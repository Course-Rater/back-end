var express = require('express');
var router = express.Router();

let user_controller = require("../controllers/userController");

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.redirect('/users/login');
});



// router.get('/login', (req, res, next) => {
//   res.render('login', {title: "Login"});
// });
// router.get('/register', (req, res, next) => {
//   res.render('register', {title: "Register"});
// });
// router.post('/login', (req, res, next) => {
//   //res.render('login', {title: "Login"});
// });
// router.post('/register', (req, res, next) => {
//   //res.render('register', {title: "Register"});
// });


router.get('/login', user_controller.user_login_get);
router.get('/register', user_controller.user_register_get);
router.post('/login', user_controller.user_login_post);
router.post('/register', user_controller.user_register_post);
module.exports = router;
