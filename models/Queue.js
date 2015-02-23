'use strict';

var mongoose = require('mongoose');

var queueSchema = mongoose.Schema({
  drinkOrderID: String,
  drinkStatus: Boolean,
  customerPicture: String
});

module.exports = mongoose.model('Queue', queueSchema);
