process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var WebAdmin = require('./app/models/WebAdmin');
var mongoose = require('./config/mongoose'),
    config   = require('./config/config'),
    express  = require('./config/express'),
    db       = mongoose(),

    app      = express(),
    cors     = require('cors');


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
// business.local.username = "habiiba";
// business.description = "Describe Me";
// business.area = "Lala Land";
// business.address = "Lala Land yemeen fi shemal";
// business.phones = "011";
// business.email = "habiiba.elghamry@gmail.com";
// business.payment_methods = "Cash";
// business.name = "Habiiba";
// business.category = "Arwash Haga";
// business.local.password = business.generateHash("123");
// business.save(function(err){
// if(err) throw err;
// });

// var Facility = require('./app/models/Facility');
// var F = new Facility(
// {
// 	name: "Facility3",
//     description: "Hi I'm a Facility",
//     capacity: 50,
//     business_id:"58f0f3faaa02d151aa4c987c"

// });
// F.save();

// var EventOcc = require('./app/models/Event').EventOccurrences;
// var E = new EventOcc(
// {
// 	day: new Date(),
//     time: "4-5",
//     available: 7,
//     event : "58f1605e08902a21866c2c97",
//     facility_id :"58f3bddb232f9d42f7d3a3a3"

// });
// E.save();

app.listen(config.port);


module.exports = app;
console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);
