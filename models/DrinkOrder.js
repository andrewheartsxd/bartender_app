'use strict';

var mongoose = require('mongoose');

var drinkOrderSchema = mongoose.Schema({
  //Unique drink order ID
  drinkOrderID: String,
  //Customer who ordered
  customerID: String,
  //Kind of Drink
  drinkID: String,
  //Bartender who makes drink
  BartenderID: {type: String, default: null}
});

module.exports = mongoose.model('DrinkOrder', drinkOrderSchema);
