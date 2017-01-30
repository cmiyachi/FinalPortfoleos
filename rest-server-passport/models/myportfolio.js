var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myportfolioSchema = new Schema({
    postedBy : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'User'
    },
    portfolios : [{type : mongoose.Schema.Types.ObjectId, ref: 'Portfolio'}],
   
  }, {
    timestamps : true
  });

var MyPortfolio = mongoose.model('MyPortfolio', myportfolioSchema);

module.exports = MyPortfolio;
