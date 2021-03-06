var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var threadRouter=require('./routes/thread');
var commentRouter=require('./routes/comment');
var signUpRouter=require('./routes/signUp');
var walkingService=require('./routes/walkingService');
var loginRoutere=require('./routes/login');
var dogwalkerRealTimeServiceRouter=require('./routes/dogwalkerRealTimeService');
var gpsRouter=require('./routes/gps');
var dogwalkerInfoRouter=require('./routes/dogwalkerInfo');
var myPetRouter=require('./routes/myPet');


var app = express();
var path= require('path');

//LOGGER SETTING
const logger=require('./configurations/logConfiguration');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/thread',threadRouter);
app.use('/comment',commentRouter);
app.use('/signUp',signUpRouter);
app.use('/walkingService',walkingService);
app.use('/login',loginRoutere);
app.use('/dogwalkerRealTimeService', dogwalkerRealTimeServiceRouter);
app.use('/gps',gpsRouter);
app.use('/dogwalkerInfo',dogwalkerInfoRouter);
app.use('/myPet',myPetRouter);


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

