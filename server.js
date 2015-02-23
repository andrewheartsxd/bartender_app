//'use strict';

var express = require('express');
var mongoose = require('mongoose');
var barRoutes = require('./routes/barRoutes');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/barapp_development');

var app = express();
var router = express.Router();

barRoutes(router);

app.use('/api/v1', router);

app.listen(3000, function() {
  console.log('server listening on port ' + (process.env.PORT || 3000));
});
