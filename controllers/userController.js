let User = require('../models/user');
const {body, validationResult, check} = require('express-validator');
const bcrypt = require('bcrypt');

let passport = require('passport'), 
LocalStrategy = require('passport-local').Strategy;


passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (await bcrypt.compare(password, user.password)) { // change to encrypted shit
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});



exports.user_login_get = (req, res, next) => {
    res.render('login', {title: "Login"});
}

exports.user_register_get = (req, res, next) => {
    res.render('register', {title: "Register"});
}



exports.user_login_post = passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true 
});



exports.user_register_post = [
    body('email', 'Email is required').trim().isEmail().normalizeEmail(),
    body('username', 'Username is required').trim().isLength({min: 1, max: 130}).isAlpha().escape(),

    //check if passwords match
    body('password', 'Password is required')
        .isLength({min: 3})
        .custom((value, { req }) => {
            if (value != req.body.password2) {
                // trow error if passwords do not match
                throw new Error("Passwords don't match");
            } else {
                return true;
            }
    }),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.render('register', {title: "Register", errors: errors.array()});
            return;
        }

        // hash the passwords
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            // if err, do something
            if(err) return next(err);
            // otherwise, store hashedPassword in DB
            const user = new User({
                email: req.body.email,
                username: req.body.username,
                password: hashedPassword
              }).save(err => {
                if (err) { 
                  return next(err);
                };
                res.redirect("/");
              });
     
          });


        
        
    }
    ]
   //res.render('register', {title: "Register"}) 
