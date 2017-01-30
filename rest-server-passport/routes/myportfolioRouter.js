var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Myportfolio = require('../models/myportfolio');
var Verify = require('./verify');

var myportfolioRouter = express.Router();
myportfolioRouter.use(bodyParser.json());

myportfolioRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
  var userId = req.decoded._id;
  Myportfolio.findOne({"postedBy": userId})
  .populate('postedBy')
  .populate('portfolios')
  .exec(function (err, portf) {
    res.json(portf);
  });
})

.post(Verify.verifyOrdinaryUser, function (req, res, next) {
  var userId = req.decoded._id;
  Myportfolio.findOne({"postedBy": userId}, function (err, portf) {
    if (err) next(err);
    if (!portf) {
      console.log('creating new port item');
      portf = new Myportfolio();
      console.log(portf);
      console.log(req.body._id);
      portf.postedBy = userId;
    }


    var idx = portf.portfolios.indexOf(req.body._id);
    if (idx == -1) {
      console.log("idx");
      console.log(idx);
  //    console.log(this_url);
      portf.portfolios.push(req.body._id);
    //  portf.myUrl=this_url;
    }
    portf.save(function (err, portf) {
      if (err) next(err);
      console.log('Updated My Portfolio!');
      res.json(portf);
    });
  });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
  var userId = req.decoded._id;
  Myportfolio.findOneAndRemove({"postedBy": userId}, function (err, portf) {
    if (err) next(err);
    console.log('Deleted Myportfolio!');
    res.json(portf);
  });
})

myportfolioRouter.route('/:portfolioId')
.delete (Verify.verifyOrdinaryUser, function (req, res, next) {
  var userId = req.decoded._id;
  console.log(userId);
  Myportfolio.findOne({"postedBy": userId}, function (err, portf) {
    if (err) next(err);
    var idx = -1;
    if (portf && portf.portfolios)
      idx = portf.portfolios.indexOf(req.params.portfolioId);
    if (idx != -1) {
      portf.portfolios.splice(idx, 1);
      if (portf.portfolios.length == 0) {
        portf.remove(function (err, portf) {
          if (err) next(err);
          console.log('Updated Portfolio!');
          res.json(null);
        });
      }
      else {
        portf.save(function (err, portf) {
          if (err) next(err);
          console.log('Updated Portfolio!');
          res.json(portf);
        });
      }
    }
    else {
      console.log('Updated Portfolio!');
      res.json(portf);
    }
  });
});

module.exports = myportfolioRouter;
