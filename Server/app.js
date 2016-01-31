'use strict';

var PORT = process.env.PORT || 3000;

var express = require('express');
// exposes various factories to create middlewares;
// all middlewares will populate the req.body with the parsed
// body or an empty object if no body to parse | error;
var bodyParser = require('body-parser');
// HTTP request logger middleware for node
var morgan = require('morgan');
// mongodb object modeling designed to work in async. env.
var mongoose = require('mongoose');
var authMiddleware = require('./util/authMiddleware');
// provides a express middleware that can be used to enable
// CORS with various options; in this case, enable all CORS reqs;
var cors = require('cors');
var app = express();
app.use(cors());

// b/c the app uses only one database, using mongoose.connect instead
// of .createConnection;
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://127.0.0.1/Unlimited');

// GENERAL MIDDLEWARE
// predefined formats: dev -> concise output colored by resp. status
// for dev. use; the :status token will be colored red for server
// error codes, yellow for client error codes, cyan for redirection
// codes, and uncolored for all other codes;
app.use(morgan('dev'));
// returns middleware that only parses urlencoded bodies;
// a new body object containing the parsed data is populated
// on the req. object after the middleware;
// extended option allows to choose between parsing the URL-encoded
// data with the querystring lib (when false) or qs lib (when true);
app.use(bodyParser.urlencoded( {extended: true} ));
// returns middleware that only parses json; a new body object
// containing the parsed data is populated on the req object;
// limit: one of the options, controls the max. req. body size
// default is 100kb
app.use(bodyParser.json({limit: '100Mb'}));

// ROUTES
app.use('/API/auth', require('./routes/loginAndRegister'));
app.use('/API/users', authMiddleware, require('./routes/Users'));
app.use('/API/items', authMiddleware, require('./routes/items'));
app.use('/API/bids', authMiddleware, require('./routes/bids'));
app.use('/API/images', authMiddleware, require('./routes/img'));
//app.use('*', require('./routes/index'))

// binds and listens for connections on the specified host / port
app.listen(PORT, function(){
  console.log('Listening on port ', PORT);
});
