'use strict';

var mongoose = require('mongoose');

var drinkOrderSchema = mongoose.Schema({
  //Unique drink order ID
  customerUsername: String,
  //Customer who ordered
  customerID: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  //Drink name
  drinkName: String, 
  //Kind of Drink
  drinkID: {type: mongoose.Schema.Types.ObjectId, ref: 'Drink'},
  //Customer Profile Picture
  customerPicture: String,
  //Bartender who makes drink
  bartenderID: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  //Is the drink being made?
  orderInProgress: {type: Boolean, default: false},
  //Is it visible in the queue?
  orderInQueue: {type: Boolean, default: true}
});

module.exports = mongoose.model('DrinkOrder', drinkOrderSchema);
