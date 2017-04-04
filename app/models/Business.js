var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;


var BusinessSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    password: String,
    email: String,
    phones: [String],
    address: String,
    area: String,
    description: String,
    merchant_ID: String,
    category: [String], //or int? can be in more than one category
    location: { Lat: SchemaTypes.Double, Lng: SchemaTypes.Double },
    average_rating: SchemaTypes.Double,
    public:
    {
        type: Number, default: 0
    },
    payment_methods: [String], //or int?

    subscribers    : [{type: mongoose.Schema.Types.ObjectId, ref:'RegisteredUser',default: []}], //whenever user subscribes to business, add him to this list.
    images        :[String],
    delete: {
        type: Number, default:0
    }

});

//created a text index on the desired fields
BusinessSchema.index({
    name: "text",
    area: "text",
    description: "text"
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
