var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var founders = require('../models/founders');

var Verify = require('./verify');

var foundersRouter = express.Router();

foundersRouter.use(bodyParser.json());

foundersRouter.route('/')
.get(function (req, res, next) {
  console.log("inside getting founders");
    founders.find(req.query, function (err, founders) {
    console.log("inside find",founders);
    if (err) next(err);
    res.json(founders);
  });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  founders.create(req.body, function (err, founders) {
    if (err) next(err);
    console.log('founders created!');
    var id = founders._id;
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Added the founders with id: ' + id);
  });
})

.delete (Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  founders.remove({}, function (err, founders) {
    if (err) next(err);
    res.json(founders);
  });
});

foundersRouter.route('/:foundersId')
.get(function (req, res, next) {
  founders.findById(req.params.foundersId, function (err, founders) {
    if (err) next(err);
    res.json(founders);
  });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  founders.findByIdAndUpdate(req.params.foundersId, {
    $set: req.body
  }, {
    new: true
  }, function (err, founders) {
    if (err) next(err);
    res.json(founders);
  });
})

.delete (Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  founders.findByIdAndRemove(req.params.foundersId, function (err, founders) {
    if (err) next(err);
    res.json(founders);
  });
});

module.exports = foundersRouter;