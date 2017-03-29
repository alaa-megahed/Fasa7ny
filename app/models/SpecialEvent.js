/**Special events are events that are not made available permanently by the business 
 * They can be events that are held on a weekly, monthly, annual basis, or held at arbitrary times. 
 * repition_type accounts for which pattern the business follows
 */
var mongoose = require('mongoose');
var specialEventSchema = mongoose.Schema({
    name: String,
    description: String,
    location: String,
    price: Double,
    capacity: Integer,
    repition_type: Integer, // to be changes to repition_pattern 
    timing: [Date]

});

var SpecialEvent = mongoose.model("specialEvent", specialEventSchema);

module.exports = SpecialEvent;  