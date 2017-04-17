var mongoose = require('mongoose'),
     Schema   = mongoose.Schema;
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;

var BookingSchema = new Schema({
	charge		 : SchemaTypes.Double,
    booking_date : Date,
    count        : {type: Number, default: 1}, // how many people
    booker       : {type: mongoose.Schema.Types.ObjectId, ref: 'RegisteredUser'},
    event_id     : {type: mongoose.Schema.Types.ObjectId, ref:'EventOccurrences'}
  	
});
var Booking = mongoose.model('Booking', BookingSchema);
module.exports = Booking;








