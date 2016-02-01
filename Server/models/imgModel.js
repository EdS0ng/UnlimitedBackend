'use strict';

const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let Img;

let imgSchema = Schema({
  img: {type: String, required: true}
});

Img = mongoose.model('Img', imgSchema);

module.exports = Img;
