'use strict';

const Img = require('../models/imgModel');
const Item = require('../models/itemModel');
const User = require('../models/userModel');
const express = require('express');

let router = express.Router();

function createImgAndSaveRef(field, req, res) {
  Img.create({img: req.body.img}, function (err, img){
    if (err) res.status(400).send(err);
    User.findByIdAndUpdate(req.userId, {field:img._id}, function (err, user){
      res.status(err ? 400 : 200).send(err || user);
    })
  })
}

router.post('/avatar', function (req, res){
  createImgAndSaveRef('avatar', req, res);
})

router.post('/bgImg', function (req, res){
  createImgAndSaveRef('backgroundImg', req, res);
})

module.exports = router;
