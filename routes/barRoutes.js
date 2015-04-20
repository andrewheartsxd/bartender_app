'use strict';

var Bar = require('../models/Bar');
var Drink = require('../models/Drink');
var DrinkOrder = require('../models/DrinkOrder');
var bodyparser = require('body-parser');
var eat_auth = require('../lib/eat_auth');

module.exports = function(app, appSecret) {
  app.use(bodyparser.json());

// Bar
 
  //create a new bar
  app.post('/cheers/bars', eat_auth(appSecret), function(req, res) {
   var newBar = new Bar(req.body);
   newBar.save(function(err, data) {
     if (err) return res.status(500).send({'msg': 'could not create bar'});
     res.json(data);
   });
  });

  //retrieve list of bars
  app.get('/cheers/bars', eat_auth(appSecret), function(req, res) {
    Bar.find({}, function(err, data) {
      if (err) return res.status(500).send({'msg': 'could not retrive bars'});
      res.json(data);
    });

  });

// Drink
  
  //retrieve drinks that can be made at a bar 
  app.get('/cheers/bars/:barID/drinks', eat_auth(appSecret), function(req, res) {
    Bar.findById(req.params.barID, function(err, bar) {
      if (err) return res.status(500).send({'msg': 'could not retrieve drinks'});
      res.json(bar.drinks);
    });
  });
   
  //adds a drink to a bar 
  app.post('/cheers/bars/:barID/newdrink', eat_auth(appSecret), function(req, res) {
    var newDrink = new Drink(req.body);

    Bar.findById(req.params.barID, function(err, bar) {
      if(err) throw err;
      console.log(bar);
      bar.drinks.push({
        drinkName: req.body.drinkName,
        drinkPrice: req.body.drinkPrice,
        drinkRecipe: req.body.drinkRecipe,
        drinkPicture: req.body.drinkPicture
      }); 
      bar.save(function(err, bar) {
        if (err) throw err;
        console.dir(bar);
        res.json(bar);
      });
    });
  });

// Drink Order

  //retrieve drink orders at a bar set to visible (the queue) 
  app.get('/cheers/bars/:barID/drinkorders', eat_auth(appSecret), function(req, res) {
    //Bar
    //  .findById(req.params.barID)
    //  .populate('drinkOrderQueue.customerID')
    //  .exec(function(err, bar) {
    //    bar.save(function(err, bar) {
    //      if (err) throw err;
    //      console.log("bar saved");
    //      console.dir(bar.drinkOrderQueue[0].customerID);
    //      res.json(bar);
    //    });
    //  });
    Bar.findById(req.params.barID, function(err, bar) {
      var drinkOrder = bar.drinkOrderQueue.filter(function (drinkOrder) {
        return (drinkOrder.orderInQueue);
      });
      console.log("SHOULD BE DRINK ORDERS");
      console.dir(drinkOrder);
      res.json(drinkOrder);
    }); 
  });

  //create drink order at a bar
  app.post('/cheers/bars/:barID/newdrinkorder', eat_auth(appSecret), function(req, res) {
    
    var newDrinkOrder = new DrinkOrder(req.body);

    newDrinkOrder.drinkID = req.body.drinkID;
    //console.log('newDrinkOrder.drinkID: ' + newDrinkOrder.drinkID);

    newDrinkOrder.customerID = req.user[0]._id;
    newDrinkOrder.customerUsername = req.user[0].username;
    newDrinkOrder.customerPicture = 'https://cheers-bartender-app.herokuapp.com/' + req.user[0]._id + '.jpg';

    Bar.findById(req.params.barID, function(err, bar) {
      if (err) throw err;
      newDrinkOrder.drinkName = bar.drinks.id(newDrinkOrder.drinkID).drinkName;
      bar.drinkOrderQueue.push(newDrinkOrder);
      bar.save(function(err, bar) {
        if (err || bar === null) return res.status(500).send({'msg': 'could not save drink order'});
        console.dir(bar.drinkOrderQueue);
        res.json(bar.drinkOrderQueue);
      });        
    });

    var stripe = require("stripe")("sk_test_BQokikJOvBiI2HlWgH4olfQ2");
    var stripeToken = req.body.stripeToken;

    var charge = stripe.charges.create({
      amount: 1000, // amount in cents, again
      currency: "usd",
      source: stripeToken,
      description: "payinguser@example.com"}, function(err, charge) {
        if (err && err.type === 'StripeCardError') {
          console.log("Credit Card Declined");
        }
        console.log('charge:');
        console.dir(charge);  
      }
    );

  });

  //update drinkOrder object's bartenderID, sets orderInProgress to true 
  app.put('/cheers/bars/:barID/drinkorders/:drinkorderID', eat_auth(appSecret), function(req, res) {
    if (req.user[0].bartender) {

      Bar.findById(req.params.barID, function(err, bar) {
        if (err) throw err;

        var drinkOrder = bar.drinkOrderQueue.id(req.params.drinkorderID);
        console.dir(drinkOrder);
        drinkOrder.bartenderID = req.user[0]._id;
        drinkOrder.orderInProgress = true;

        bar.save(function(err, bar) {
          if (err || bar === null) return res.status(500).send({'msg': 'could not add bartender'});
          console.dir(bar.drinkOrderQueue);
          res.json(bar.drinkOrderQueue);
        });
      });

    } else {
      console.dir(req.user);
      return res.status(403).send({'msg': 'could not add bartender (bad auth)'});
    }
  });

  //allow bartender to mark order as completed
  app.put('/cheers/bars/:barID/drinkorders/:drinkorderID/completed', eat_auth(appSecret), function(req, res) {
    if (req.user[0].bartender) {

      Bar.findById(req.params.barID, function(err, bar) {
        if (err) throw err;

        var drinkOrder = bar.drinkOrderQueue.id(req.params.drinkorderID);
        console.dir(drinkOrder);
        drinkOrder.orderInQueue = false;

        bar.save(function(err, bar) {
          if (err || bar === null) return res.status(500).send({'msg': 'could not mark as completed'});
          console.dir(bar.drinkOrderQueue);
          res.json(bar.drinkOrderQueue);
        });
      });
    } else {
      console.dir(req.user);
      return res.status(403).send({'msg': 'could not add bartender (bad auth)'});
    }
  });
};

