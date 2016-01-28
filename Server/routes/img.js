'use strict';

const Img = require('../models/imgModel');
const Item = require('../models/itemModel');
const express = require('express');

let router = express.Router();

router.post('/avatar', function (req, res){
  Img.create( {img: {data: req.body.img.base64, contentType:req.body.img.filetype}} , function(err, newImg){
    if (err) return res.status(400).send(err);
    User.findById(req.userId, function(err, user){
      if (err) return res.status(400).send(err);
      user.avatar = newImg._id;
      user.save(function(err){
        user.avatar = newImg;
        user = user.toObject();
        delete user.password;
        res.status(err ? 400 : 200).send(err || user);
      });
    })
  });
})

router.post('/bgImg', function (req, res){
  Img.create( {img: {data: req.body.img.base64, contentType:req.body.img.filetype}} , function(err, newImg){
    if (err) return res.status(400).send(err);
    User.findById(req.userId, function(err, user){
      if (err) return res.status(400).send(err);
      user.backgroundImg = newImg._id;
      user.save(function(err){
        user.backgroundImg = newImg;
        user = user.toObject();
        delete user.password;
        res.status(err ? 400 : 200).send(err || user);
      });
    })
  });
})

router.post('/itemImg', function (req, res){
  console.log('itemId', req.itemId);
  Img.create( {img: {data: req.body.img.base64, contentType:req.body.img.filetype}} , function(err, newImg){
    if (err) return res.status(400).send(err);
    Item.findByIdAndUpdate(req.itemId,{$addToSet:{itemImg:newImg._id}}, function(err, item){
      if (err) return res.status(400).send(err);
      res.status(err ? 400 : 200).send(err || item);
    });
  });
})

module.exports = router;