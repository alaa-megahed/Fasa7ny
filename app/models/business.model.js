
var mongoose      = require('mongoose'),
    Schema        = mongoose.Schema,
    Subscribers   = mongoose.model('Registered_User'); //needed for notification system later

require('mongoose-double')(mongoose);

var BuinessSchema = new Schema({
    username      : String,
    password      : String,
    email         : String,
    phones        :[String],
    description   : String,
    merchant_ID   : String,
    category      :[String], //or int? can be in more than one category
    location      : String,  //url string or x and y doubles?
    average_rating: SchemaTypes.Double,
    public        : 
    {
        type: int, default:0
    },
    payment_methods: [String], //or int?
    subscribers    : [{type: mongoose.Schema.Types.ObjectId, ref:'Subscribers',default: []}] 
    //whenever user subscribes to business, add him to this list.



});

var Business = mongoose.model('Business', BusinessSchema);
module.exports = Business;
