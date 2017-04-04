var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var RegisteredUserSchema = new Schema({
    name          : String,
    username      : String,
    password      : String,
    email         : String,
    phone         : String,
    birthdate     : Date,
    address       : String,  //url string or x and y doubles?
    gender        : String,
    profilePic    : String,
    bookings      : [{type: mongoose.Schema.Types.ObjectId, ref:'Booking',default: []}],
    subscriptions : [{type: mongoose.Schema.Types.ObjectId, ref:'Business',default: []}]
});

var RegisteredUser = mongoose.model('RegisteredUser', RegisteredUserSchema);
module.exports = RegisteredUser;
