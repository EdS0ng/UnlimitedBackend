'use strict';

const express = require('express');
const Item = require('../models/itemModel');
const Img = require('../models/imgModel');

var router = express.Router();

router.get('/', function (req, res){
  Item.find({}).populate('itemImg').exec(function (err, items){
    res.status(err ? 400 : 200).send(err || items);
  });
})

router.post('/', function (req, res){
  var arr = Object.keys(req.body);
  req.body = JSON.parse(arr[0]);
  let newItem = new Item(req.body.item);
  newItem.owner = req.userId;
  newItem.save(function (err, item){
    if (err) return res.status(400).send(err);
    Img.create( {img:req.body.img} , function(err, newImg){
      if (err) return res.status(400).send(err);
      Item.findByIdAndUpdate(item._id,{$addToSet:{itemImg:newImg._id}}, function(err, item){
        if (err) return res.status(400).send(err);
        res.status(err ? 400 : 200).send(err || item);
      });
    });
  })
})

router.put('/', function (req, res){
  var arr = Object.keys(req.body);
  req.body = JSON.parse(arr[0]);
  Item.findByIdAndUpdate(req.body._id, req.body, function (err, updatedItem){
    res.status(err ? 400 : 200).send(err || 'updated');
  })
})

router.delete('/', function (req, res){
 Item.findById(req.body._id, function (err, toBeRemoved){
    err ? console.log(err) : toBeRemoved.remove(function (err, removed){
      res.status(err ? 400: 200).send(err || 'removed');
    })
  })
})

module.exports = router;
