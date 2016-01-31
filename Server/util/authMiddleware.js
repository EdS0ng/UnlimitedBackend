'use strict';

// JWT(JSON web token) encode and decode module;
// default algorithm to encode is HS256;
const jwt    = require('jwt-simple')
// lightweight JS data library for parsing, validating,
// manipulating and formatting dates;
    , moment = require('moment')
    , CONFIG = require('../config/auth')
    , User   = require('../models/userModel');

module.exports = function(req, res, next) {
  console.log("authing route: ", req.url);
  // if they pass in a basic auth credential, it'll be in a header
  // called 'authorization'; auth is in base64(username:password);
  // so we need to decode the base64
  if (!req.headers.authorization) {
    return res.status(401).send('authorization required');
  }

// bearer token: security token with the property that any party
// in possession of the token 'a bearer' can use the token in
// any way that any other party in possession of it can;
  let token = req.headers.authorization.replace('Bearer ', '');

  try {
    // => {foo: 'bar'}
    var decoded = jwt.decode(token, process.env.JWT_SECRET);
  } catch (e) {
    return res.status(401).send('authorization required');
  }

// to create a moment from a Unix timestap (seconds since
// the Unix Epoch)
  if (decoded.exp < moment().unix()) {
    return res.status(401).send('authorization expired');
  }

  if (CONFIG.refreshToken) {
    User.findById(decoded.id, (err, user) => {
      if (err) return res.status(400).send('server error');
      if (!user) return res.status(401).send('authorization required');
      req.userId = decoded.id;
      res.set('Authorization', `Bearer ${user.token()}`)
      // pass control to the next middleware function,
      // otherwise the request will be left hanging;
      next();
    });
  } else {
    req.userId = decoded.id;
    next();
  }
};
