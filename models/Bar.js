'use strict';

var mongoose = require('mongoose');
var Drink = require('./Drink.js');
var DrinkOrder = require('./DrinkOrder.js');

var barSchema = mongoose.Schema({
  //Name of the bar
  barName: String,
  //Array of drinks available at a bar
  drinks: [Drink.schema],
  //Array of drink orders at a bar 
  drinkOrderQueue: [DrinkOrder.schema],
  //drinkOrderQueue: [{type: mongoose.Schema.Types.ObjectId, ref: 'DrinkOrder'}],
});

module.exports = mongoose.model('Bar', barSchema);
