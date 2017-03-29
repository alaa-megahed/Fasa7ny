
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;
    Booker   = mongoose.model('Registered_User'); //Name of registered user schema

var BookingSchema = new Schema({
    booking_date : Date,
    booker       :
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booker' 
    },
    event_id     : String
    //payment goes here

});

var Booking = mongoose.model('Booking', BookingSchema);
module.exports = Booking;
