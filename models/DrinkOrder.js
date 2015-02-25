'use strict';

var mongoose = require('mongoose');

var drinkOrderSchema = mongoose.Schema({
  //Customer who ordered
  customerID: String,
  //Kind of Drink
  drinkID: String,
  //Bartender who makes drink
  bartenderID: {type: String, default: null},
  //Time Stamp
  timeStamp: String
});

module.exports = mongoose.model('DrinkOrder', drinkOrderSchema);
