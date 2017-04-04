var mongoose      = require('mongoose'),
    Schema        = mongoose.Schema,
    bcrypt   = require('bcrypt-nodejs');

require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;


var BusinessSchema = new Schema({
    local         :
    {   
        username: 
        {
            type : String,
            required : true,
            unique : true
        },
        password: 
        {
            type : String,
            required : true
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date 
    },    
    user_type     : {type: Number, default: 2},
    name          :
    {
        type: String,
        unique: true
    },
    email         : String,
    phones        : [String],
    description   : String,
    merchant_ID   : String,
    category      : [String], //or int? can be in more than one category
    location      : { Lat: SchemaTypes.Double, Lng: SchemaTypes.Double },
    address: String,
    area: String,
    description: String,  
    average_rating: SchemaTypes.Double,
    public:
    {
        type: Number, default: 0
    },
    payment_methods: [String], //or int?

    subscribers    : [{type: mongoose.Schema.Types.ObjectId, ref:'RegisteredUser',default: []}], //whenever user subscribes to business, add him to this list.
    reviews        : [{type: mongoose.Schema.Types.ObjectId, ref:'Review',default: []}],
    images         : [String],
    delete         : 
    {
        type: Number, default:0
    }

});


//created a text index on the desired fields
BusinessSchema.index({
    name: "text",
    area: "text",
    description: "text"
});

// generating a hash (encrypted password)
BusinessSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if (encrypted) password is valid
BusinessSchema.methods.validPassword = function(password) {
    return (bcrypt.compareSync(password, this.local.password));
};


var Business = mongoose.model('Business', BusinessSchema);
module.exports = Business;
