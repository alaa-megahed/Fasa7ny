var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var RatingSchema = new Schema({
    user_ID : String,
    business_ID : String,                 // how many people
    rating       : Number,
    event_id     : String
});

var Rating = mongoose.model('Rating', RatingSchema);
module.exports = Rating;
