var mongoose = require('mongoose');
var SchemaTypes = mongoose.Schema.Types;
// defining schemas

/**
 * PermanentEvent is an event that is available at any given point in time as an essential part of the business's
 * operation
 * They can be events that are held on a weekly, monthly, annual basis, or held at arbitrary times.
 * repition_type accounts for which pattern the business follows
 */

var permanentEventSchema = mongoose.Schema({
    name: String,
    description: String,
    location: String,
    price: SchemaTypes.Double,
    capacity: Number,
    available: Number,
    repition_type: Number, // to be changes to repition_pattern
    timing: [Date],
    images: [String],
    business_id  :
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business' 
    },
    bookings :
    [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        default: []
    }]

});

/**Special events are events that are not made available permanently by the business
    They don't have to be repeated
 */

var specialEventSchema = mongoose.Schema({
    name: String,
    description: String,
    location: String,
    price: SchemaTypes.Double,
    capacity: Number,
    available: Number,
    timing: Date,
    images: [String],
    business_id  :
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business' 
    },
    bookings :
    [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        default: [] 
    }]
});


//creating models
var SpecialEvent   = mongoose.model("SpecialEvent", specialEventSchema);
var PermanentEvent = mongoose.model("PermanentEvent", permanentEventSchema);


//exporting models
module.exports = {
    PermanentEvent: PermanentEvent,
    SpecialEvent: SpecialEvent
};
