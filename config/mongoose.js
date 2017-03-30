require('../app/models/Booking');
require('../app/models/Business');
require('../app/models/Event');
require('../app/models/Offer');
require('../app/models/RegisteredUser');
require('../app/models/WebAdmin');


var mongoose = require('mongoose'),
    config = require('./config');



module.exports = function() {
    var db = mongoose.connect(config.db);
    return db;
};
