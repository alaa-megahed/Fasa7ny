var mongoose      = require('mongoose'),
    Schema        = mongoose.Schema,

require('mongoose-double')(mongoose);

var BuinessSchema = new Schema({
    username      : String,
    password      : String,
    email         : String,
    phones        :[String],
    description   : String,
    merchant_ID   : String,
    category      :[String], //or int? can be in more than one category
    location      : { Lat: SchemaTypes.Double, Lng: SchemaTypes.Double },  
    average_rating: SchemaTypes.Double,
    public        : 
    {
        type: int, default:0
    },
    payment_methods: [String], //or int?
    subscribers    : [{type: mongoose.Schema.Types.ObjectId, ref:'RegisteredUser',default: []}], //whenever user subscribes to business, add him to this list.
    images        :[String] 

});

var Business = mongoose.model('Business', BusinessSchema);
module.exports = Business;
