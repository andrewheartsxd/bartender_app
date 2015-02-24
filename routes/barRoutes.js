'use strict';

var DrinkOrder = require('../models/DrinkOrder');
var Drink = require('../models/Drink');
var Bartender = require('../models/Bartender');
var Queue = require('../models/Queue');
var bodyparser = require('body-parser');


module.exports = function(app) {
  app.use(bodyparser.json());

  app.get('/cheers', function(req, res) {
    Drink.find({}, function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not retrieve drinks'});
      res.json(data);
    });
  });

  app.post('/cheers', function(req, res) {
    var newDrink = new DrinkOrder(req.body);
    newDrink.save(function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not save drink'});
      
      res.json(data);
    });
  });

  app.put('/cheers:bartenderName', function(req, res) {
    var updatedDrinkOrder = req.body;
    delete req.body._id;
    DrinkOrder.update({bartenderName: req.params.bartenderName}, updatedDrinkOrder, function(err, data) {
     if (err) return res.status(500).send({'msg': 'could not add bartender'});

     res.json(req.body);
    });
  });

};





















