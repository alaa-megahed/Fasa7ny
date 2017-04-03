var mongoose = require('mongoose'),
     Schema   = mongoose.Schema;

var SchemaTypes = mongoose.Schema.Types;

var offerSchema = new Schema({
<<<<<<< HEAD
  name        : String,
  type 			 	: String, //can be updated
  value       : SchemaTypes.Double, //can be updated
  details		 	: String, //can be updated
  start_date : { type: Date, default: new Date() }, //can be updated
  expiration_date	: Date, //can be updated
  notify_subscribers: Boolean, //boolean or int? //can be updated
=======
  type 			 	: String,
  value       : SchemaTypes.Double,
  details		 	: String,
  start_date : { type: Date, default: Date.now },
  expiration_date	: Date,
  notify_subscribers: Boolean, //boolean or int?
>>>>>>> subscription
  business:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'business'
<<<<<<< HEAD
  }, // cannot be updated
  image: String //can be updated
});

var Offer = mongoose.model("Offer", offerSchema);
module.exports = Offer;
=======
  },
  images: [String]
});

var offer = mongoose.model("Offer", offerSchema);
module.exports = offer
>>>>>>> subscription
