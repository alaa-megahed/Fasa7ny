var mongoose = require('mongoose'),
     Schema   = mongoose.Schema;

var SchemaTypes = mongoose.Schema.Types;

var offerSchema = new Schema({
  name        : String,
  type 			 	: String, //can be updated
  value       : SchemaTypes.Double, //can be updated
  details		 	: String, //can be updated
  start_date : { type: Date, default: new Date() }, //can be updated
  expiration_date	: Date, //can be updated
  notify_subscribers: Boolean, //boolean or int? //can be updated
  business:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'business'
  }, // cannot be updated
  image: String //can be updated
});

var Offer = mongoose.model("Offer", offerSchema);
module.exports = Offer;
