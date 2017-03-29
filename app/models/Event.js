var mongoose = require('mongoose');

// defining schemas 

/**
 * PermanentEvent is an event that is available at any given point in time as an essential part of the business's 
 * operation
 */

var permanentEventSchema = mongoose.Schema({
    name: String,
    description: String,
    location: String,
    price: Double,
    capacity: Integer,
    datetime: Date

});


/**Special events are events that are not made available permanently by the business 
 * They can be events that are held on a weekly, monthly, annual basis, or held at arbitrary times. 
 * repition_type accounts for which pattern the business follows
 */

var specialEventSchema = mongoose.Schema({
    name: String,
    description: String,
    location: String,
    price: Double,
    capacity: Integer,
    repition_type: Integer, // to be changes to repition_pattern 
    timing: [Date]

});


//creating models
var SpecialEvent = mongoose.model("specialEvent", specialEventSchema);
var PermanentEvent = mongoose.model("permanentEvent", permanentEventSchema);


//exporting models
module.exports = PermanentEvent;  
module.exports = SpecialEvent;