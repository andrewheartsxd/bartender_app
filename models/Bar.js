'use strict';

var mongoose = require('mongoose');

var barSchema = mongoose.Schema({
  barName: String,
  barLocation: String,
  barCustomers: [some array],
  barTenders: [some array]
});

module.exports = mongoose.model('Bar', barSchema);
