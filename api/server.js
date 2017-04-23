process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var WebAdmin = require('./app/models/WebAdmin');
var mongoose = require('./config/mongoose'),
    config   = require('./config/config'),
    express  = require('./config/express'),
    db       = mongoose(),

    app      = express();


// var Events = require('./app/models/Event');


// var event = new Events();
// event.name = "Name";
// event.description = "Event Description";
// event.location = "Cairo";
// event.capacity = "30";
// event.price = "100";
// event.repeated = "Once";
// event.business_id = "58f7693c51294567b2d8b083";
// event.save();

var EventOccurrences = require('./app/models/Event').EventOccurrences;

// var Facility = require('./app/models/Facility');

// var facility = new Facility();
// facility.name = "room1";
// facility.description = "facility description";
// facility.capacity = "10";
// business_id = "58f0cb2d6bfb6061efd66625";
// facility.business_id = "58f7693c51294567b2d8b083";
// facility.save();


// var Business = require('./app/models/Business');

// var business = new Business();
// business.local.username = "EscapeRoom";
// business.name = "Escape Room";
// business.local.password = business.generateHash("111");
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
//     time: "1-3",
//     available: 40,
//     event : "58f9ef0a884967421f8ed009",
//     facility_id :"58f9eeda54894641dd7453ae",
// business_id : "58f0cb2d6bfb6061efd66625",

// });
// E.save();
// var admin = new WebAdmin();
// admin.local.username = "radwa";
// admin.local.password = admin.generateHash("1234");
// admin.save(
//   function(err)
//     {if(err) throw err;}
// );



app.listen(config.port);


module.exports = app;
console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);
