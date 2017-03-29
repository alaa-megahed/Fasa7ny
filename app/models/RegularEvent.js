var mongoose = require('mongoose'); 

var regularEventSchema = mongoose.Schema({
   name: String,
   description: String,
   location: String, 
   price: Double,
   capacity: Integer,
   booking: [String], //to be changes to booking or removed altogether
   datetime: Date

}); 

var RegularEvent = mongoose.model("regularEvent", regularEventSchema); 

module.exports = RegularEvent;  