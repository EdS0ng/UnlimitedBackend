'use strict';

const express = require('express');
const Item = require('../models/itemModel');

var router = express.Router();

router.get('/', function (req, res){
  Item.find({}, function (err, items){
    res.status(err ? 400 : 200).send(err || items);
  })
})

router.post('/', function (req, res){
  let newItem = new Item(req.body.item);
  newItem.owner = req.userId;
  newItem.save(function (err, item){
    if (err) res.status(400).send(err);
    req.itemId = item._id;
    res.redirect('/API/images/itemImg');
  })
})

router.put('/', function (req, res){
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