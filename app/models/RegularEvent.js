var mongoose = require('mongoose'); 

var regularEventSchema = mongoose.Schema({
   name: String,
   description: String,
   location: String, 
   price: Double,
   capacity: Integer,
   datetime: Date

}); 

var RegularEvent = mongoose.model("regularEvent", regularEventSchema); 

module.exports = RegularEvent;  