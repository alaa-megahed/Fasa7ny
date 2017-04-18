var mongoose = require('mongoose'),
     Schema   = mongoose.Schema;
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;
require('mongoose-double')(mongoose);

var BookingSchema = new Schema({
    booking_date : Date,
    count        : {type: Number, default: 1}, // how many people
    booker       : {type: mongoose.Schema.Types.ObjectId, ref: 'RegisteredUser'},
    event_id     : {type: mongoose.Schema.Types.ObjectId, ref:'EventOccurrences'},
    charge       : SchemaTypes.Double,		//amount
    stripe_charge: String,					//token for refund
    original_charge: SchemaTypes.Double,
    offer_id     : String
});
var Booking = mongoose.model('Booking', BookingSchema);
module.exports = Booking;








