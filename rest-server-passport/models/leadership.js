// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var leaderSchema = new Schema({
    name : {
      type : String,
      required : true,
      unique : true
    },
    image : {
      type : String
    },
    designation : {
      type : String,
      required : true
    },
    abbr : {
      type : String,
      required : true
    },
    description : {
      type : String,
      required : true
    },
    featured: {
      type: String,
      default:"false"
    }
  }, {
    timestamps : true
  });

// the schema is useless so far
// we need to create a model using it
var leadership = mongoose.model('leadership', leaderSchema);

// make this available to our Node applications
module.exports = leadership;
