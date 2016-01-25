'use strict';

const mongoose = require('mongoose');
const moment = require('moment');


let Bid,
    Schema = mongoose.Schema;

let bidSchema = Schema({
  user: {type:Schema.Types.ObjectId, ref:'User', required:true},
  value:{type:String,required:true},
  item:{type: Schema.Types.ObjectId, ref:'Item', required:true}
});

bidSchema.post('save', function (next){
  this.model('Item').update({_id:this.item}, { $addToSet: {bids: this._id} }, function (err, results){
    if (err){
      console.log(err);
    }else{
      console.log(results);
    }
  });
  this.model('User').update({_id:this.user}, {$addToSet:{bids:this._id}}, function (err, result){
    if (err){
      console.log(err);
    }else{
      console.log(result)
    }
  })
})

bidSchema.post('remove', function (next){
  this.model('Item').update({_id:this.item}, { $pull: {bids: this._id} }, function (err, results){
    if (err){
      console.log(err);
    }else{
      console.log(results);
    }
  });
  this.model('User').update({_id:this.user}, {$pull:{bids:this._id}}, function (err, result){
    if (err){
      console.log(err);
    }else{
      console.log(result)
    }
  })
})



Bid = mongoose.model('Bid', bidSchema);
module.exports = Bid;