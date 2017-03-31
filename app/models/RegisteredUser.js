var mongoose = require('mongoose'),
Schema   = mongoose.Schema;


var RegisteredUserSchema = new Schema({
    local:
    {
        username: 
        {
            type : String,
            required : true,
            unique : true
        },
        password: 
        {
            type : String,
            required : true
        }    
    }, 
    userType   : {type: Number, default: 1},
    name       : String,
    email      : String,
    phone      : String,
    birthdate  : Date,
    address    : String,  //url string or x and y doubles?
    gender     : String,
    profilePic : String

});

var RegisteredUser = mongoose.model('RegisteredUser', RegisteredUserSchema);
module.exports = RegisteredUser;
