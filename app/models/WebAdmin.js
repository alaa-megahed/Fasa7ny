var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var WebAdminSchema = new Schema({ 
    username   : String,
    password   : String
});   

var WebAdmin = mongoose.model('WebAdmin', WebAdminSchema);
module.exports = WebAdmin;     