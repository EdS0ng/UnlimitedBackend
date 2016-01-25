'use strict';

const express = require('express');
const item = require('../models/itemModel');

var router = express.Router();

router.get('/', function (req, res){
  item.find({}, function (err, items){
    res.status(err ? 400 : 200).send(err || items);
  })
})

router.post('/', function (req, res){

  let newItem = new item(req.body);
  newItem.owner = req.userId;
  newItem.save(function (err, item){
    res.status(err ? 400 : 200).send(err || item);
  })
})

router.put('/', function (req, res){
  item.findByIdAndUpdate(req.body._id, req.body, function (err, updatedItem){
    res.status(err ? 400 : 200).send(err || 'updated');
  })
})

router.delete('/', function (req, res){
  item.findById(req.body._id, function (err, toBeRemoved){
    err ? console.log(err) : toBeRemoved.remove(function (err, removed){
      res.status(err ? 400: 200).send(err || 'removed');
    })
  })
})

module.exports = router;