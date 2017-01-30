var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var leadership = require('../models/leadership');

var Verify = require('./verify');

var leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get(function (req, res, next) {
  console.log("inside getting leaders");
  // Leaders.find(req.query function (err, leader) {
    leadership.find(req.query, function (err, leader) {
    console.log("inside find",leader);
    if (err) next(err);
    res.json(leader);
  });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  leadership.create(req.body, function (err, leader) {
    if (err) next(err);
    console.log('Leader created!');
    var id = leader._id;
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Added the leader with id: ' + id);
  });
})

.delete (Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  leadership.remove({}, function (err, leader) {
    if (err) next(err);
    res.json(leader);
  });
});

leaderRouter.route('/:leaderId')
.get(function (req, res, next) {
  leadership.findById(req.params.leaderId, function (err, leader) {
    if (err) next(err);
    res.json(leader);
  });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  leadership.findByIdAndUpdate(req.params.leaderId, {
    $set: req.body
  }, {
    new: true
  }, function (err, leader) {
    if (err) next(err);
    res.json(leader);
  });
})

.delete (Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  leadership.findByIdAndRemove(req.params.leaderId, function (err, leader) {
    if (err) next(err);
    res.json(leader);
  });
});

module.exports = leaderRouter;