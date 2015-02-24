'use strict';

var DrinkOrder = require('../models/DrinkOrder');
var Drink = require('../models/Drink');
var Bartender = require('../models/Bartender');
var Queue = require('../models/Queue');
var bodyparser = require('body-parser');


module.exports = function(app) {
  app.use(bodyparser.json());

// Drink

  app.get('/cheers/drink', function(req, res) {
    Drink.find({}, function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not retrieve drinks'});
      res.json(data);
    });
  });

  app.post('/cheers/drink', function(req, res) {
    var newDrink = new Drink(req.body);
    newDrink.save(function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not save drink'});
      
      res.json(data);
    });
  });

// Drink Order

  app.get('/cheers/order', function(req, res) {
    DrinkOrder.find({}, function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not retrieve drink orders'});
      res.json(data);
    });
  });

  app.post('/cheers/drinkorder', function(req, res) {
    var newDrinkOrder = new DrinkOrder(req.body);
    newDrinkOrder.save(function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not save drink order'});
      
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

// Bartender

  app.get('/cheers/bartender', function(req, res) {
    Bartender.find({}, function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not retrieve bartender'});
      res.json(data);
    });
  });

  app.post('/cheers/bartender', function(req, res) {
    var newBartender = new Bartender(req.body);
    newBartender.save(function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not save bartender'});
      
      res.json(data);
    });
  });


// Queue

  app.get('/cheers/queue', function(req, res) {
    Queue.find({}, function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not retrieve queue'});
      res.json(data);
    });
  });

  app.post('/cheers/queue', function(req, res) {
    var newQueue = new Queue(req.body);
    newQueue.save(function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not save queue'});
      
      res.json(data);
    });
  });

};




