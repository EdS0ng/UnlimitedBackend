'use strict';

const express = require('express');
const User = require('../models/userModel');
const Img = require('../models/imgModel');

let router = express.Router();

// router.get('/', function (req, res){
//   User.find({}).populate('avatar')
//   .exec(function (err, users){
//     users = users.map(user => {
//       user = user.toObject();
//       delete user.password;
//       return user;
//     });
//     res.status(err ? 400 : 200).send(err || users);
//   });
// });

// router.post('/favorite', function (req, res){
//   User.toggleFavorite(req.userId, req.body.favorites, function (err, user){
//     res.status(err ? 400 : 200).send(err || 'ok');
//   })
// });

router.get('/me', function(req, res){
  User.findById(req.userId).populate('avatar backgroundImg itemsForSale bids')
  .exec(function(err, user){
    user = user.toObject();
    delete user.password;
    res.status(err ? 400 : 200).send(err || user);
  });
});

router.put('/', function (req, res){
  User.findByIdAndUpdate(req.userId, req.body, function (err, updatedUser){
    updatedUser = updatedUser.toObject();
    delete updatedUser.password;
    res.status(err ? 400 : 200).send(err || updatedUser);
  });
});

router.delete('/', function (req, res){
  User.findById(req.userId, function (err, toBeRemoved){
    err ? console.log(err) : toBeRemoved.remove(function (err, removed){
      res.status(err ? 400 : 200).send(err || 'removed');
    })
  });
});

module.exports = router;
