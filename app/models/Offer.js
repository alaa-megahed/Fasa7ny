var mongoose = require('mongoose'),
     Schema   = mongoose.Schema;

var SchemaTypes = mongoose.Schema.Types;

var offerSchema = new Schema({
  name        : String,
  type 			 	: String,
  value       : SchemaTypes.Double,
  details		 	: String,
  start_date : { type: Date, default: new Date() },
  expiration_date	: Date,
  notify_subscribers: Number, //boolean or int?
  business:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'business'
  },
  image: String
});

var Offer = mongoose.model("Offer", offerSchema);
module.exports = Offer;
