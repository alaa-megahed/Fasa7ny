var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;



var AdvertisementSchema = new Schema({
    image       : type :String,
    text        : type : String,
    start_date  : type :Date,
    end_date    : type : Date,
    available   : {type: Number, default: 1}
    //payment goes here

});

var Advertisement = mongoose.model('Advertisement', AdvertisementSchema);
module.exports = Advertisement;