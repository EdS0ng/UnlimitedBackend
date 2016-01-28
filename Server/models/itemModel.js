'use strict';

const mongoose = require('mongoose');
const moment = require('moment');
const User = require('./userModel');

let Item,
    Schema = mongoose.Schema;

let itemSchema = Schema({
  name: {type:String, required:true},
  itemImg: [{type: Schema.Types.ObjectId, ref:'Img' }],
  value:String,
  TimePosted:{type:Date, default:moment()},
  description:String,
  tags:[{type:String}],
  owner:{type: Schema.Types.ObjectId, ref:'User'},
  bids:[{type: Schema.Types.ObjectId, ref:'Bid'}]
});

itemSchema.post('save', function (next){
  this.model('User').update({_id:this.owner}, { $addToSet: {itemsForSale: this._id} }, function (err, results){
    if (err){
      console.log(err);
    }else{
      console.log(results);
    }
  });
})

itemSchema.post('remove', function (next){
  console.log('remove', this._id);
  this.model('User').update({_id:this.owner}, {$pull:{itemsForSale:this._id}}, function (err, result){
    console.log('pulled', result)
    if (err){
      console.log(err)
    }else{
      console.log(result);
    }
  })
  this.model('Bid').remove({_id:{ $in:this.bids}}, function (err, results){
    if (err){
      console.log(err)
    }else{
      console.log(results);
    }
  })
})

Item = mongoose.model('Item', itemSchema);
module.exports = Item;