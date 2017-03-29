var mongoose = require('mongoose'),
    business = mongoose.model('Business');


var offerSchema = new Schema({
  type 			 	: String,
  details		 	: String,
  expiration_date	: Date,
  notify_subscribers: Boolean, //boolean or int?
  business:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'business'
  }

});

var offer = mongoose.model("Offer", offerSchema);
module.exports = Offer