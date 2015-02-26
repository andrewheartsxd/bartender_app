'use strict';

var DrinkOrder = require('../models/DrinkOrder');
var Drink = require('../models/Drink');
var Bartender = require('../models/Bartender');
var bodyparser = require('body-parser');
var eat_auth = require('../lib/eat_auth');

module.exports = function(app, appSecret) {
  app.use(bodyparser.json());

// Drink

  //retrieve all drinks that can be made
  app.get('/cheers/drink', eat_auth(appSecret), function(req, res) {
    Drink.find({}, function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not retrieve drinks'});
      res.json(data);
    });
  });

  //add new drink to database (WILL BE POPULATED BY DEVS)
  //fields: drinkName, drinkRecipe, drinkPicture
  app.post('/cheers/drink', eat_auth(appSecret), function(req, res) {
    var newDrink = new Drink(req.body);
    newDrink.save(function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not save drink'});
      
      res.json(data);
    });
  });

  //update drinks that can be made (FOR DEVELOPMENT) 
  app.put('/cheers/drink/:drink', eat_auth(appSecret), function(req, res) {
    var updatedDrink = req.body;
    delete req.body._id;
    Drink.update({drinkName: req.params.drink}, updatedDrink, function(err, data) {
     if (err) return res.status(500).send({'msg': 'could not add bartender'});

     res.json(req.body);
    });
  });


// Drink Order

  //retrieves all drink orders (the queue)
  app.get('/cheers/drinkorder', eat_auth(appSecret), function(req, res) {
    DrinkOrder.find({}, function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not retrieve drink orders'});
      res.json(data);
    });
  });

  //create new drink order
  //fields: drinkOrderID, customerID, drinkID, bartenderID
  app.post('/cheers/drinkorder', eat_auth(appSecret), function(req, res) {
    var newDrinkOrder = new DrinkOrder(req.body);
    newDrinkOrder.save(function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not save drink order'});
      
      res.json(data);
    });
  });

  //update drinkOrder object's bartenderID, sets orderInProgress to true - the passed in body needs to be the entire drink order, with bartender set to null
  app.put('/cheers/drinkorder/:drinkorderid', eat_auth(appSecret), function(req, res) {
    if (req.user[0].bartender) {
      var updatedDrinkOrder = req.body;
      updatedDrinkOrder.bartenderID = req.user[0]._id;
      updatedDrinkOrder.orderInProgress = true;
      updatedDrinkOrder.orderInQueue = true;
      delete req.body._id;
      DrinkOrder.update({_id: req.params.drinkorderid}, updatedDrinkOrder, function(err, data) {
       if (err) return res.status(500).send({'msg': 'could not add bartender'});

       res.json(req.body);

      });
    } else {
      console.dir(req.user);
      return res.status(403).send({'msg': 'could not add bartender (bad auth)'});
    }
  });



  //allow bartender to mark order as completed
  app.put('/cheers/drinkorder/completed/:drinkorderid', eat_auth(appSecret), function(req, res) {
    if (req.user[0].bartender) {
      var updatedDrinkOrder = req.body;
      updatedDrinkOrder.orderInQueue = false;
      delete req.body._id;
      DrinkOrder.update({_id: req.params.drinkorderid}, updatedDrinkOrder, function(err, data) {
       if (err) return res.status(500).send({'msg': 'could not add bartender'});

       res.json(req.body);

      });
    } else {
      console.dir(req.user);
      return res.status(403).send({'msg': 'could not add bartender (bad auth)'});
    }
  });
};





