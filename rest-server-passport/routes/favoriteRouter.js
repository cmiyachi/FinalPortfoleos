var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
  var userId = req.decoded._id;
  Favorites.findOne({"postedBy": userId})
  .populate('postedBy')
  .populate('dishes')
  .exec(function (err, fav) {
    res.json(fav);
  });
})

.post(Verify.verifyOrdinaryUser, function (req, res, next) {
  var userId = req.decoded._id;
  Favorites.findOne({"postedBy": userId}, function (err, fav) {
    if (err) next(err);
    if (!fav) {
      fav = new Favorites();
      fav.postedBy = userId;
    }
    
    var idx = fav.dishes.indexOf(req.body._id);
    if (idx == -1) {
      fav.dishes.push(req.body._id);
    }
    fav.save(function (err, fav) {
      if (err) next(err);
      console.log('Updated Favorites!');
      res.json(fav);
    });
  });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
  var userId = req.decoded._id;
  Favorites.findOneAndRemove({"postedBy": userId}, function (err, fav) {
    if (err) next(err);
    console.log('Deleted Favorites!');
    res.json(fav);
  });
})

favoriteRouter.route('/:dishId')
.delete (Verify.verifyOrdinaryUser, function (req, res, next) {
  var userId = req.decoded._id;
  console.log(userId);
  Favorites.findOne({"postedBy": userId}, function (err, fav) {
    if (err) next(err);
    var idx = -1;
    if (fav && fav.dishes)
      idx = fav.dishes.indexOf(req.params.dishId);
    if (idx != -1) {
      fav.dishes.splice(idx, 1);
      if (fav.dishes.length == 0) {
        fav.remove(function (err, fav) {
          if (err) next(err);
          console.log('Updated Portfolio!');
          res.json(null);
        });
      }
      else {
        fav.save(function (err, fav) {
          if (err) next(err);
          console.log('Updated Portfolio!');
          res.json(fav);
        });
      }
    }
    else {
      console.log('Updated Favorites!');
      res.json(fav);
    }
  });
});

module.exports = favoriteRouter;
