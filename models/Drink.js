'use strict';

var mongoose = require('mongoose');

var drinkSchema = mongoose.Schema({
  //Type of Drink
  drinkName: String,
  //Drink Price
  drinkPrice: Number,
  //Drink Ingredients
  drinkRecipe: [String],
  //Drink Picture
  drinkPicture: String,
});

module.exports = mongoose.model('Drink', drinkSchema);
