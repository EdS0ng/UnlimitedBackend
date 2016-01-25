'use strict';

const express = require('express');
const Bid = require('../models/bidModel');

var router = express.Router();

router.get('/:id', function (req, res){
  Bid.findById(req.params.id, function (err, bid){
    res.status(err ? 400 : 200).send(err || bid);
  })
})

router.post('/', function (req, res){
  var newBid = new Bid(req.body);
  newBid.user = req.userId;
  newBid.save(function (err, saved){
    res.status(err ? 400 : 200).send(err || saved);
  })
})

//change bid?

router.delete('/', function (req, res){
  Bid.findById(req.body._id, function (err, toBeRemoved){
    try{
      err ? console.log(err) : toBeRemoved.remove(function (err, removed){
        res.status(err ? 400 : 200).send(err || 'removed');
      })
    }catch(e){
      console.log(e);
    }
  })
})

module.exports = router;