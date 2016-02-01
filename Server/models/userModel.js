'use strict';

const mongoose = require('mongoose')
    , jwt      = require('jwt-simple')
    , bcrypt   = require('bcryptjs')
    , moment   = require('moment')
    , CONFIG   = require('../config/auth');


let User,
    Schema = mongoose.Schema;

let userSchema = Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type:String, default: 'Enter an Email'},
  itemsForSale: [{type:Schema.Types.ObjectId, ref: 'Item'}],
  bids: [{type:Schema.Types.ObjectId, ref:'Bid'}],
  profilename: {type: String, default:'Enter a Profile Name'},
  phone: {type:String, default:'Enter a Phone Number'},
  address: {type: String, default:'Enter an Address'},
  about:{type: String, default:'Enter a Short Description'},
  avatar:{type:Schema.Types.ObjectId, ref:'Img'},
  backgroundImg: {type:Schema.Types.ObjectId, ref:'Img'}
});

userSchema.methods.token = function() {
  let payload = {
    id: this._id,
    iat: moment().unix(),
    exp: moment().add(CONFIG.expTime.num, CONFIG.expTime.unit).unix()
  };
  return jwt.encode(payload, process.env.JWT_SECRET);
};

userSchema.statics.login = function(userInfo, cb) {
  // look for user in database
  User.findOne({username: userInfo.username}).populate('avatar')
  .exec((err, foundUser) => {
    if (err) return cb('server error');
    if (!foundUser) return cb('incorrect username or password');
    bcrypt.compare(userInfo.password, foundUser.password, (err, isGood) => {
      if (err) console.log("bcrypt error");
      if (err) return cb('server err');
      if (isGood) {
        return cb(null, foundUser);
      } else {
        return cb('incorrect username or password');
      }
    });
  });
}

userSchema.statics.register = function(userInfo, cb) {
  let username  = userInfo.username
    , password  = userInfo.password
    , password2 = userInfo.password2;

  // compare passwords
  if (password !== password2) {
    return cb("passwords don't match");
  }

  // validate password
  if (!CONFIG.validatePassword(password)) {
    return cb('invalid password');
  }

  // validate username
  if (!CONFIG.validateUsername(username)) {
    return cb('invalid username');
  }

  // create user model
  User.findOne({username: username}, (err, user) => {
    if (err) return cb('error registering username');
    if (user) return cb('username taken');
    bcrypt.genSalt(CONFIG.saltRounds, (err, salt) => {
      if (err) return cb(err);
      bcrypt.hash(password, salt, (err, hashedPassword) => {
        if (err) return cb(err);
        let newUser = new User({
          username: username,
          password: hashedPassword
        });
        newUser.save((err, savedUser) => {
          return cb(err, savedUser);
        })
      });
    });
  })
};

userSchema.statics.toggleFavorite = function(userId, link, cb){
  User.findById(userId, function (err, user){
    var foundFavIndex = user.favorites.indexOf(link);
    if (foundFavIndex===-1) {
      user.favorites.push(link)
    } else {
      user.favorites.splice([foundFavIndex],1);
    }
    user.save(cb)
  })
}

userSchema.post('remove', function (next){
  this.model('Item').remove({_id:{$in:this.itemsForSale}}, function (err, results){
    err ? console.log(err) : console.log('item removed');
  })
  this.model('Bid').remove({_id:{$in:this.bids}}, function (err, results){
    err ? console.log(err) : console.log('bid removed');
  })
  this.model('Img').remove({_id:this.avatar}, function (err, result){
    err ? console.log(err) : console.log('avatar removed');
  })
})



User = mongoose.model('User', userSchema);
module.exports = User;
