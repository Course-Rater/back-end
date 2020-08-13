var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var universityRouter = require('./routes/university');

var app = express();

//Set up mongoose connection
var mongoose = require('mongoose');

var mongoDB = 'mongodb+srv://admin:admin@cluster0.iyp6b.mongodb.net/cluster1?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true }); 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



// Passport 
let passport = require('passport'), 
LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
let User = require('../models/user');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/universities', universityRouter);


// Login routers
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


app.use(passport.initialize());



user_login_get = (req, res, next) => {
  res.render('login', {title: "Login"});
}

user_register_get = (req, res, next) => {
  res.render('register', {title: "Register"});
}



user_login_post = passport.authenticate('local', { 
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true 
});



user_register_post = [
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



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
