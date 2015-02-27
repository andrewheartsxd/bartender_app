'use strict';

process.env.MONGO_URI = 'mongodb://localhost/barapp_test';
require('../server.js');
var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
var fs = require('fs');
chai.use(chaihttp);

var expect = chai.expect;

describe('The Bartender App', function(){
  var token, originalFiles;
    before(function(done) {
      originalFiles = fs.readdirSync('./public').length;
      chai.request('localhost:3000/api/v1')
        .post('/create_user')
        .send({email: 'sample@sample', password: 'foobar123', username: 'boozeHound', userPic: 'sample pic', bartender: false})
        .end(function(err, res) {
          if (err) throw err;
        token = res.body.eat;
        done();
    });
  });
  after(function(done) {
      mongoose.connection.db.dropDatabase(function() {
        done();
      });
  });

  it('Should associate a user picture with each new user', function(done) {
    expect(originalFiles).to.be.below(fs.readdirSync('./public').length);
    done();
  });

  it('Should respond to a GET request for drink menu', function(done) {
    chai.request('localhost:3000/api/v1')
      .get('/cheers/drink')
      .send({eat: token})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        done();
      });
  });

  // it('Should respond to a POST request for a drink order', function(done) {
  //   var id;
  //   chai.request('localhost:3000/api/v1')
  //     .post('/cheers/drinkorder')
  //     .send({customerUsername: 'sample customerUsername', customerID: 'sample customerID', drinkName: 'sample drinkName', drinkID: 'sample drinkID', customerPicture: 'sample customerPicture', bartenderID: 'sample bartenderID', orderInProgress: 'sample orderInProgress', orderInQueue: 'sample orderInQueue', eat: token})
  //     .end(function(err, res) {
  //       expect(err).to.eql(null);
  //       expect(res.body.customerID).to.eql('sample customerID');
  //       done();
  //     });
  // });

  it('Should GET the current drink queue', function(done) {
    chai.request('localhost:3000/api/v1')
      .get('/cheers/drinkorder')
      .send({eat: token})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should add the newly ordered drink to the queue', function(done) {
    chai.request('localhost:3000/api/v1')
      .get('/cheers/drinkorder')
      .send({eat: token})
      .end(function(err, res) {
        done();
      });
  });

});
