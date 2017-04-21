process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var WebAdmin = require('./app/models/WebAdmin');
var mongoose = require('./config/mongoose'),
    config   = require('./config/config'),
    express  = require('./config/express'),
    db       = mongoose(),

    app      = express(),
    cors     = require('cors');


// var Events = require('./app/models/Event').Events;

// var event = new Events();
// event.name = "Rip Curl";
// event.description = "Event Description";
// event.location = "Cairo";
// event.capacity = "30";
// event.price = "100";
// event.repeated = "Daily";
// event.business_id = "58f0f3faaa02d151aa4c987c";
// event.facility_id = "58f9cfd8aefe190f02fd3174";
// event.save();

// var EventOccurrences = require('./app/models/EventOccurrences');
// var Facility = require('./app/models/Facility');

// var facility = new Facility();
// facility.name = "room1";
// facility.description = "facility description";
// facility.capacity = "10";
// facility.business_id = "58f0cb2d6bfb6061efd66625";
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


//  var Event = require('./app/models/Event').Events;
// var ev = new Event(
// 	{
	
// 	location : "locloc",
// 	name : "Testing delete f1",
// 	description : "please",
// 	price : 300,
// 	capacity : 40,
// 	repeated : "Daily",
// 	facility_id : "58f9ebf5a4722b1eef681d6a",
// 	business_id : "58f0f3faaa02d151aa4c987c",
// 	location : "lolla",
// 	name : "koko ",
// 	description : "please",
// 	price : 150,
// 	capacity : 40,
// 	repeated : "Daily",
// 	facility_id : "58f9eeda54894641dd7453ae",
// 	business_id : "58f0cb2d6bfb6061efd66625",
// 	daysOff : [ ],
// 	image : [
// 		" "
// 	]
// });
// ev.save();

// var EventOcc = require('./app/models/Event').EventOccurrences;
// var E = new EventOcc(
// {
// 	day: new Date(),
//     time: "4-7",
//     available: 17,
//     event : "58f9ec96fc8dda233e08ae54",
//     facility_id :"58f9ebf5a4722b1eef681d6a"
//     time: "1-3",
//     available: 40,
//     event : "58f9ef0a884967421f8ed009",
//     facility_id :"58f9eeda54894641dd7453ae",
// business_id : "58f0cb2d6bfb6061efd66625",


// });
// E.save();

app.listen(config.port);


module.exports = app;
console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);
