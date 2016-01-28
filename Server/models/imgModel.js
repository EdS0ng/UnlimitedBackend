'use strict';

const mongoose = require('mongoose');

let Img,
    Schema = mongoose.Schema;

let imgSchema = Schema({
  img: { data: {type: String, required: true} , contentType: String }
});

Img = mongoose.model('Img', imgSchema);
module.exports = Img;
