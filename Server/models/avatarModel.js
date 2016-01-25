'use strict';

const mongoose = require('mongoose');

let Avatar,
    Schema = mongoose.Schema;

let avatarSchema = Schema({
  img: { data: {type: String, required: true} , contentType: String }
});

Avatar = mongoose.model('Avatar', avatarSchema);
module.exports = Avatar;
