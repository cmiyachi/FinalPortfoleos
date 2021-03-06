// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var portfolioSchema = new Schema({
    name : {
      type : String,
      required : true,
      unique : true
    },
    image : {
      type : String
    },
    category : {
      type : String,
      required : true
    },
    label : {
      type : String,
      default : ""
    },
    description : {
      type : String,
      required : true
    },
  }, {
    timestamps : true
  });

// the schema is useless so far
// we need to create a model using it
var Portfolios = mongoose.model('Portfolio', portfolioSchema);

// make this available to our Node applications
module.exports = Portfolios;
