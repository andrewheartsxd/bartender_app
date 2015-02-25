//'use strict';

var express = require('express');
var mongoose = require('mongoose');
var barRoutes = require('./routes/barRoutes');
var passport = require('passport');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/barapp_development');

var app = express();
app.set('appSecret', process.env.SECRET || 'imanalcoholic');
app.use(passport.initialize());
require('./lib/passport_strat')(passport);

var barRouter = express.Router();
var userRouter = express.Router();

barRoutes(barRouter, app.get('appSecret'));
require('./routes/userRoutes')(userRouter, passport, app.get('appSecret'));

app.use('/api/v1', barRouter);
app.use('/api/v1', userRouter);

app.listen(3000, function() {
  console.log('server listening on port ' + (process.env.PORT || 3000));
});
