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
const university = require('./models/university');
<<<<<<< Updated upstream
var mongoDB = 'mongodb+srv://courserater:password2020@cluster0.hzlds.mongodb.net/course_rater?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true });
=======
var mongoDB = 'mongodb+srv://admin:admin@cluster0.iyp6b.mongodb.net/cluster1?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true });
>>>>>>> Stashed changes
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
