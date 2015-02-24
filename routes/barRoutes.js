'use strict';

var DrinkOrder = require('../models/DrinkOrder');
var Drink = require('../models/Drink');
var Bartender = require('../models/Bartender');
var Queue = require('../models/Queue');
var bodyparser = require('body-parser');


module.exports = function(app) {
  app.use(bodyparser.json());

// Drink

  //retrieve all drinks that can be made
  app.get('/cheers/drink', function(req, res) {
    Drink.find({}, function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not retrieve drinks'});
      res.json(data);
    });
  });

  //add new drink to database
  app.post('/cheers/drink', function(req, res) {
    var newDrink = new Drink(req.body);
    newDrink.save(function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not save drink'});
      
      res.json(data);
    });
  });

  //update drinks that can be made (FOR DEVELOPMENT) 
  app.put('/cheers/drink/:drink', function(req, res) {
    var updatedDrink = req.body;
    delete req.body._id;
    Drink.update({drinkName: req.params.drink}, updatedDrink, function(err, data) {
     if (err) return res.status(500).send({'msg': 'could not add bartender'});

     res.json(req.body);
    });
  });


// Drink Order

  //retrieves all drink orders (the queue)
  app.get('/cheers/drinkorder', function(req, res) {
    DrinkOrder.find({}, function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not retrieve drink orders'});
      res.json(data);
    });
  });

  //create new drink order
  app.post('/cheers/drinkorder', function(req, res) {
    var newDrinkOrder = new DrinkOrder(req.body);
    newDrinkOrder.save(function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not save drink'});
      
      res.json(data);
    });
  });

  //update drinkOrder object's bartenderID
  app.put('/cheers/drinkorder/:drinkorderid', function(req, res) {
    var updatedDrinkOrder = req.body;
    delete req.body._id;
    DrinkOrder.update({_id: req.params.drinkorderid}, updatedDrinkOrder, function(err, data) {
     if (err) return res.status(500).send({'msg': 'could not add bartender'});

     res.json(req.body);
    });
  });

// Bartender

  app.get('/cheers/bartender', function(req, res) {
    Bartender.find({}, function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not retrieve drink orders'});
      res.json(data);
    });
  });

  app.post('/cheers/bartender', function(req, res) {
    var newBartender = new Bartender(req.body);
    newBartender.save(function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not save drink'});
      
      res.json(data);
    });
  });

};




