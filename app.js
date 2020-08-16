var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
const result = dotenv.config()

if (result.error) {
  throw result.error
}

console.log(result.parsed)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var universityRouter = require('./routes/university');

var app = express();

var session = require('express-session');


//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.MONGO_DB_LINK;

// Set up authentication
let passport = require('passport'), 
LocalStrategy = require('passport-local').Strategy;



mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true }); 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: true })); // express now includes it in standard package

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let User = require('./models/user');
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log("Incorrect username");
        return done(null, false, { message: 'Incorrect username.' });
      }
      console.log("User found");
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          console.log("Passwords match");
          // passwords match! log user in
          return done(null, user)
        } else {
          console.log("Passwords don't match");
          // passwords do not match!
          return done(null, false, {msg: "Incorrect password"})
        }
      })
    });
  }
));
 

app.use(session({ secret: process.env.SESSION_KEY}));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/universities', universityRouter);



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
