var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Portfolios = require('../models/portfolios');

var Verify = require('./verify');

var portfolioRouter = express.Router();

portfolioRouter.use(bodyParser.json());

portfolioRouter.route('/')
.get(function (req, res, next) {
  console.log("inside portfolios get");
  Portfolios.find(req.query)
  .exec(function (err, portfolio) {
    console.log("portfolios", portfolio);
    if (err) next(err);
    res.json(portfolio);
  });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  Portfolios.create(req.body, function (err, portfolio) {
    if (err) next(err);
    console.log('portfolio created!');
    var id = portfolio._id;
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Added the portfolio with id: ' + id);
  });
})

.delete (Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  Portfolios.remove({}, function (err, portfolio) {
    if (err) next(err);
    res.json(portfolio);
  });
});

portfolioRouter.route('/:portfolioId')
.get(function (req, res, next) {
  Portfolios.findById(req.params.portfolioId)
  .populate('comments.postedBy')
  .exec(function (err, portfolio) {
    if (err) next(err);
    res.json(portfolio);
  });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  Portfolios.findByIdAndUpdate(req.params.portfolioId, {
    $set: req.body
  }, {
    new: true
  }, function (err, portfolio) {
    if (err) next(err);
    res.json(portfolio);
  });
})

.delete (Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  Portfolios.findByIdAndRemove(req.params.portfolioId, function (err, portfolio) {
    if (err) next(err);
    res.json(portfolio);
  });
});


module.exports = portfolioRouter;