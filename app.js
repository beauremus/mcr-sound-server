var express = require('express');
var ipfilter = require('express-ipfilter');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var socket_io = require('socket.io');

var app = express();

// Socket.io
var io = socket_io();
app.io = io;

var routes = require('./routes/index')(io);
var voiceTest = require('./routes/voiceTest');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/test', routes);
app.use('/voiceTest', voiceTest);

// IP allow list; all others denied
var ips = ['131.225.121.20', // cns1pc.fnal.gov
            ['131.225.121.22','131.225.121.31'], // cns2-11
            ['131.225.121.33','131.225.121.35'], // cns12-14
            '131.225.122.10', // adops126896.fnal.gov
            '131.225.122.76', // newhart
            '131.225.122.90', // djohnson
            '127.0.0.1']; // Local

// ipFiltering
app.use(ipfilter(ips, {mode: 'allow'}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
