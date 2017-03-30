var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;


var RegisteredUserSchema = new Schema({
    name       : String,  
    username   : String,
    password   : String,
    email      : String,
    phone      : String,
    birthdate  : Date,
    address    : String,  //url string or x and y doubles?
    gender     : String,
    profilePic : String
      
});

var RegisteredUser = mongoose.model('RegisteredUser', RegisteredUserSchema);
module.exports = RegisteredUser;
