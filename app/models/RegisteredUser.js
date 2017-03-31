var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    bcrypt   = require('bcrypt-nodejs');

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
    user_type  : {type: Number, default: 1},
    name       : String,
    email      : String,
    phone      : String,
    birthdate  : Date,
    address    : String,  //url string or x and y doubles?
    gender     : String,
    profilePic : String

});


// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


var RegisteredUser = mongoose.model('RegisteredUser', RegisteredUserSchema);
module.exports = RegisteredUser;
