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
  //app.get('/cheers/drink', function(req, res) {
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

  //retrieves all drink orders set to visible (the queue)
  app.get('/cheers/drinkorder', eat_auth(appSecret), function(req, res) {
    DrinkOrder.find({orderInQueue: true}, function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not retrieve drink orders'});
      console.dir(data);
      res.json(data);
    });
  });

  //create new drink order
  //fields: drinkOrderID, customerID, drinkID, bartenderID
  app.post('/cheers/drinkorder', eat_auth(appSecret), function(req, res) {
    var newDrinkOrder = new DrinkOrder(req.body);
    newDrinkOrder.customerID = req.user[0]._id;
    newDrinkOrder.customerUsername = req.user[0].username;
    newDrinkOrder.customerPicture = 'https://cheers-bartender-app.herokuapp.com/' + req.user[0]._id + '.jpg';
    //vvvvvvvv CONFIRM THIS IS PROVIDED BY iOS
    newDrinkOrder.drinkID = req.body.drinkID;
    
    Drink.find({drinkID: req.body.drinkID}, function(err, data) {
     newDrinkOrder.drinkName = data[0].drinkName; 
    });

    newDrinkOrder.save(function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not save drink order'});
      
      res.json(data);
    });
  });

  //update drinkOrder object's bartenderID, sets orderInProgress to true - the passed in body needs to be the entire drink order, with bartender set to null
  app.put('/cheers/drinkorder/:drinkorderid', eat_auth(appSecret), function(req, res) {
    if (req.user[0].bartender) {
      var updatedDrinkOrder = req.body;

      DrinkOrder.find({_id: req.params.drinkorderid}, function(err, data) {
        console.dir(data);
        updatedDrinkOrder.drinkID = data[0].drinkID;
        updatedDrinkOrder.customerUsername = data[0].customerUsername;
        updatedDrinkOrder.drinkName = data[0].drinkName;
        updatedDrinkOrder.customerID = data[0].customerID;
      });

      updatedDrinkOrder.customerPicture = req.body.customerPicture;

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

      updatedDrinkOrder.customerPicture = req.body.customerPicture;

      DrinkOrder.find({_id: req.params.drinkorderid}, function(err, data) {
        console.dir(data);
        updatedDrinkOrder.drinkID = data[0].drinkID;
        updatedDrinkOrder.customerUsername = data[0].customerUsername;
        updatedDrinkOrder.drinkName = data[0].drinkName;
        updatedDrinkOrder.customerID = data[0].customerID;
      });

      updatedDrinkOrder.bartenderID = req.user[0]._id;
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


