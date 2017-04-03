var mongoose = require('mongoose');
var SchemaTypes = mongoose.Schema.Types;

<<<<<<< HEAD
var EventsSchema = mongoose.Schema({
    name: String,
    description: String,
    location: String,
    price: SchemaTypes.Double,
    capacity: Number,
    image: [String],
    repeated: String,
    daysOff: [String],
    business_id:{type: mongoose.Schema.Types.ObjectId, ref:'Business'}
});

=======
/**
 * PermanentEvent is an event that is available at any given point in time as an essential part of the business's
 * operation
 * They can be events that are held on a weekly, monthly, annual basis, or held at arbitrary times.
 * repition_type accounts for which pattern the business follows
 */

// var permanentEventSchema = mongoose.Schema({
//     name: String,
//     description: String,
//     location: String,
//     price: SchemaTypes.Double,
//     capacity: Number,
//     available: Number,
//     repition_type: Number, // to be changes to repition_pattern
//     timing: [Date],
//     images: [String],
//     business_id:{type: mongoose.Schema.Types.ObjectId, ref:'Business'}

// });


/**Special events are events that are not made available permanently by the business
    They don't have to be repeated
 */

// var specialEventSchema = mongoose.Schema({
//     name: String,
//     description: String,
//     location: String,
//     price: SchemaTypes.Double,
//     capacity: Number,
//     available: Number,
//     timing: Date,
//     images: [String],
//     business_id:{type: mongoose.Schema.Types.ObjectId, ref:'Business'}

// });

var EventsSchema = mongoose.Schema({
    name: String,
    description: String,
    location: String,
    price: SchemaTypes.Double,
    capacity: Number,
    image: [String],
    repeated: String,
    daysOff: [String],
    business_id:{type: mongoose.Schema.Types.ObjectId, ref:'Business'}
});

>>>>>>> events
var EventOccurrencesSchema = mongoose.Schema({
    day: Date,
    time: String,
    available: Number,
    bookings : [{type: mongoose.Schema.Types.ObjectId,ref: 'Booking',default: [] }],
<<<<<<< HEAD
    event_ : {type: mongoose.Schema.Types.ObjectId, ref:'Events'}
=======
    event : {type: mongoose.Schema.Types.ObjectId, ref:'Events'}

});
>>>>>>> events

});





//creating models
var Events = mongoose.model("Events", EventsSchema);
var EventOccurrences = mongoose.model("EventOccurrences", EventOccurrencesSchema);
<<<<<<< HEAD
=======

>>>>>>> events

//exporting models
module.exports = {
    Events: Events,
    EventOccurrences: EventOccurrences
<<<<<<< HEAD

=======
>>>>>>> events
};
