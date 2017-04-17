process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var WebAdmin = require('./app/models/WebAdmin');
var mongoose = require('./config/mongoose'),
    config   = require('./config/config'),
    express  = require('./config/express'),
    db       = mongoose(),
    app      = express(),
    cors     = require('cors');


var Business = require('./app/models/Business');

// var b = new Business();
// b.local.username = "nourhan";
// b.local.password = b.generateHash("password");
// b.name = "Nourhan";
// b.merchant_ID = "12345";
// b.save(function(err){if(err) throw err;});
// app.use(cors());

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
