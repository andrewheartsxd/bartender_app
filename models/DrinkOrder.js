'use strict';

var mongoose = require('mongoose');

var drinkOrderSchema = mongoose.Schema({
  customerID: String,
  drinkID: String,
  BarID: String,
  BartenderID: String
});

module.exports = mongoose.model('DrinkOrder', drinkOrderSchema);
