var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var WebAdminSchema = new Schema({ 
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
    userType   : {type: Number, default: 3}
});   

var WebAdmin = mongoose.model('WebAdmin', WebAdminSchema);
module.exports = WebAdmin;     