'use strict';

const express = require('express')
    , User    = require('../models/userModel');
var authMiddleware = require('../util/authMiddleware');

let router = express.Router();

router.post('/register', (req, res) => {
  User.register(req.body, (err, user) => {
    res.status(err ? 400 : 200)
    .send(err || "Registered!");
  });
});

router.get('/check', authMiddleware, (req, res)=>{
  res.status(200).send('ok');
})

router.post('/login', (req, res) => {
  User.login(req.body, (err, user) => {
    if(err){
      res.status(400).send(err);
      return;
    }
    var token = user.token();
    user = user.toObject();
    delete user.password;
    res.status(err ? 400 : 200)
    .send(err || {token: token});
  });
});

module.exports = router;
