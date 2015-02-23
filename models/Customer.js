'use strict';

var mongoose = require('mongoose');

var customerSchema = mongoose.Schema({
  customerName: String,
  customerVerified: Boolean,
});

module.exports = mongoose.model('Customer', customerSchema);
