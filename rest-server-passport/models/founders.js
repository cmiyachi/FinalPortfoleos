// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var foundersSchema = new Schema({
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
var founders = mongoose.model('founders', foundersSchema);

// make this available to our Node applications
module.exports = founders;
