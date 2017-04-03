var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var RegisteredUserSchema = new Schema({
<<<<<<< HEAD
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

=======
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
>>>>>>> subscription
});

var RegisteredUser = mongoose.model('RegisteredUser', RegisteredUserSchema);
module.exports = RegisteredUser;
