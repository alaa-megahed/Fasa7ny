process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var WebAdmin = require('./app/models/WebAdmin');
var mongoose = require('./config/mongoose'),
    config   = require('./config/config'),
    express  = require('./config/express'),
    db       = mongoose(),
    Business = require("./app/models/Business")

    app      = express();


app.listen(config.port);

// var Events = require('./app/models/Event');

// var event = new Events();
// event.name = "Name";
// event.description = "Event Description";
// event.location = "Cairo";
// event.capacity = "30";
// event.price = "100";
// event.repeated = "Once";
// event.business_id = "58f20e01b38dec5d920104f3";
// event.save();

// var EventOccurrences = require('./app/models/EventOccurrences');
// var Facility = require('./app/models/Facility');

// var facility = new Facility();
// facility.name = "room1";
// facility.description = "facility description";
// facility.capacity = "10";
// facility.business_id = "58f20e01b38dec5d920104f3";
// facility.save();
// var Business = require('./app/models/Business');

// var business = new Business();
// business.local.username = "EscapeRoom";
// business.name = "Escape Room";
// business.local.password = business.generateHash("111");
// business.save(function(err){
// if(err) throw err;
// });



module.exports = app;
console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);
