let express = require('express');
let router = express.Router();
let user_controller = require('../controllers/userController');




/* GET home page. */
router.get('/', (req, res, next) => {

  // MAIN PAGE = search all universities in react
  res.render('index', { title: 'Main Page' });
});

/* GET login page */
router.get('/login', user_controller.user_login_get);

/* GET singup page */
router.get('/signup', user_controller.user_register_get);

/* GET logout - logout of passport */
router.get('/logout', user_controller.user_login_post);



module.exports = router;