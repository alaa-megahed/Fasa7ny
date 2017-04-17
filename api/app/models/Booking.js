var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

var BookingSchema = new Schema({
    booking_date : Date,
    count        : {type: Number, default: 1}, // how many people
    booker       : {type: mongoose.Schema.Types.ObjectId, ref: 'RegisteredUser'},
    event_id     : {type: mongoose.Schema.Types.ObjectId, ref:'EventOccurrences'},
    //payment goes here
    charge       : Number
});

var Booking = mongoose.model('Booking', BookingSchema);
module.exports = Booking;
