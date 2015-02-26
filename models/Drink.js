'use strict';

var mongoose = require('mongoose');

var drinkSchema = mongoose.Schema({
  //Type of Drink
  drinkName: String,
  //Drink Ingredients
  drinkRecipe: [String],
  //Drink Picture
  drinkPicture: String,
});

module.exports = mongoose.model('Drink', drinkSchema);
