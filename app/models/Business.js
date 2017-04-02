var mongoose      = require('mongoose'),
    Schema        = mongoose.Schema;

require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;


var BusinessSchema = new Schema({
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
        type: Number, default:0
    },
    payment_methods: [String], //or int?
    subscribers    : [{type: mongoose.Schema.Types.ObjectId, ref:'RegisteredUser',default: []}], //whenever user subscribes to business, add him to this list.
    images        :[String]

});

// generating a hash
BusinessSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
BusinessSchema.methods.validPassword = function(password) {
    return (bcrypt.compareSync(password, this.password));
};

var Business = mongoose.model('Business', BusinessSchema);
module.exports = Business;
