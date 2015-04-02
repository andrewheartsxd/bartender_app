'use strict';

var mongoose = require('mongoose');

var bartenderSchema = mongoose.Schema({
  //Bartender Name
  bartenderName: String
});

module.exports = mongoose.model('Bartender', bartenderSchema);
