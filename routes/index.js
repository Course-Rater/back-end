let express = require('express');
let router = express.Router();
let user_controller = require('../controllers/userController');




/* GET home page. */
router.get('/', (req, res, next) => {

  // MAIN PAGE = search all universities in react
  res.render('index', { title: 'Main Page', user: req.user });
});

/* login page */
router.get('/login', user_controller.user_login_get);

router.post('/login', user_controller.user_login_post);


/* singup page */
router.get('/signup', user_controller.user_register_get);

router.post('/signup', user_controller.user_register_post);

/* GET logout - logout of passport */
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect("/");
});



module.exports = router;