require('../app/models/Booking');
require('../app/models/Business');
require('../app/models/Event');
require('../app/models/Offer');
require('../app/models/RegisteredUser');
require('../app/models/WebAdmin');
require('../app/models/Rating');
require('../app/models/Review');



var mongoose = require('mongoose'),
    config = require('./config');



module.exports = function() {

    mongoose.Promise = global.Promise;
    var db = mongoose.connect(config.db);
    return db;
};
