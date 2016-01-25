'use strict';

const express = require('express');
const User = require('../models/userModel');
const Avatar = require('../models/avatarModel');

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
  User.findById(req.userId).populate('avatar')
  .exec(function(err, user){
    user = user.toObject();
    delete user.password;
    res.status(err ? 400 : 200).send(err || user);
  });
});

router.put('/', function (req, res){
  User.findByIdAndUpdate(req.body._id, req.body)
  .populate('avatar')
  .exec(function (err, updatedUser){
    updatedUser = updatedUser.toObject();
    delete updatedUser.password;
    res.status(err ? 400 : 200).send(err || updatedUser);
  });
});

router.delete('/', function (req, res){
  User.findById(req.body._id, function (err, toBeRemoved){
    err ? console.log(err) : toBeRemoved.remove(function (err, removed){
      res.status(err ? 400 : 200).send(err || 'removed');
    })
  });
});

router.post('/avatar', function(req, res){
  console.log("id confirmation", req.userId, Object.keys(req.body.img));
  if (req.userId === req.body._id){
    Avatar.create( {img: {data: req.body.img.base64, contentType:req.body.img.filetype}} , function(err, newAvatar){
      if (err) return res.status(400).send(err);
      User.findById(req.userId, function(err, user){
        if (err) return res.status(400).send(err);
        user.avatar = newAvatar._id;
        user.save(function(err){
          user.avatar = newAvatar;
          user = user.toObject();
          delete user.password;
          res.status(err ? 400 : 200).send(err || user);
        });
      })
    });
  }else{
    res.status(403).send('You are not authorized to do this action');
  }
})

module.exports = router;
