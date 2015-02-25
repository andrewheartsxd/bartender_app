'use strict';

var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/User');

module.exports = function(passport) {
  passport.use('basic', new BasicStrategy({}, function(email, password, done) {
    User.findOne({'basic.email': email}, function(err, user) {
      if (err) return done('could not authenticate');

      if (!user) return done('could not authenticate');

      if (!user.validPassword(password)) return done('could not authenticate');

      return done(null, user);
    });
  }));
};
