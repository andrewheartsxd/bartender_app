'use strict';

var mongoose = require('mongoose');

var customerSchema = mongoose.Schema({
  customerName: String,
  customerVerified: True/False,
});

module.exports = mongoose.model('Customer', customerSchema);
