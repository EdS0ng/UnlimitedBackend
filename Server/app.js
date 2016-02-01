'use strict';

var PORT = process.env.PORT || 3001;

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var authMiddleware = require('./util/authMiddleware');
var cors = require('cors');
// require('dotenv').load();
var app = express();
app.use(cors());

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://127.0.0.1/Unlimited');

// GENERAL MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.urlencoded( {extended:false, limit:'50Mb'} ));
app.use(bodyParser.text({type: 'text/plain'}));
// app.use(bodyParser.json({limit: '100Mb'}));

// ROUTES
app.use('/API/auth', require('./routes/loginAndRegister'));
app.use('/API/users', authMiddleware, require('./routes/Users'));
app.use('/API/items', authMiddleware, require('./routes/items'));
app.use('/API/bids', authMiddleware, require('./routes/bids'));
app.use('/API/images', authMiddleware, require('./routes/img'));
//app.use('*', require('./routes/index'))

app.listen(PORT, function(){
  console.log('Listening on port ', PORT);
});
