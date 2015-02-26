'use strict';

var bodyparser = require('body-parser');
var User = require('../models/User');
var fs = require('fs');

module.exports = function(app, passport, appSecret) {
  app.use(bodyparser.json());
  app.post('/create_user', function(req, res) {

    var newUser = new User();


    newUser.basic.email = req.body.email;
    newUser.basic.password = newUser.generateHash(req.body.password);
    if(req.body.promoCode === "alcoholic") newUser.bartender = true;
    newUser.save(function(err, user) {
      if (err) return res.status(500).send({msg: 'could not create user'});

    //saves profile picture to /public folder as _id.jpg
      User.find({'basic.email': newUser.basic.email}, function(err, data) {
        if (err) return res.status(500).send({msg: 'could not create user'});

        var userMongoID = data[0]._id;
        //should be req.body.imageString vvvvvvvvvvvvvvvvvv
        var imageBuff = fs.readFileSync('./public/b52.jpg');
        fs.writeFileSync('./public/' + userMongoID + '.jpg', imageBuff);
        console.dir(userMongoID);
      });


      user.generateToken(appSecret, function(err, token) {
        if (err) res.status(500).send({msg: 'could not generate token'});
        res.json({eat: token});
      });
    });
  });

  app.get('/sign_in', passport.authenticate('basic', {session: false}), function(req, res) {
    req.user.generateToken(appSecret, function(err, token) {
      if (err) res.status(500).send({msg: 'could not generate token'});
      res.json({eat: token});
    });
  });
};
