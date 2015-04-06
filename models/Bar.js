'use strict';

var mongoose = require('mongoose');

var barSchema = mongoose.Schema({
  //Name of the bar
  barName: String,
  //Array of drinks available at a bar
  drinks: Array,
  //Array of drink orders 
  drinkQueue: Array,
});

module.exports = mongoose.model('Bar', barSchema);
