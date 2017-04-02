var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var RegisteredUserSchema = new Schema({
    name       : String,
    username   : String,
    password   : String,
    email      : String,
    phone      : String,
    birthdate  : Date,
    address    : String,  
    gender     : String,
    profilePic : String,
    bookings   : [{type: mongoose.Schema.Types.ObjectId, ref:'Booking',default: []}]

});

var RegisteredUser = mongoose.model('RegisteredUser', RegisteredUserSchema);
module.exports = RegisteredUser;
