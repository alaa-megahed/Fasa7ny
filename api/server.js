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
// event.business_id = "58f20e01b38dec5d920104f3";
// event.save();


 var Admin = require('./app/models/WebAdmin');
 var webAdmin = new Admin();
 webAdmin.local.username = "WebAdmin";
  webAdmin.local.password = webAdmin.generateHash("Password1234");
  webAdmin.save(function(err){
if(err) throw err;
});


// var business = new Businesses();
// business.local.username = "Naaame";
// business.description = "Business Descriptions";
// business.area = "New Cairo";
// business.address = "S El-Teseen St, Building#311, 90th Street, New Cairo, New Cairo, Cairo Governorate 1996";
// business.phones = ["+201005467300", "2034857632"];
// business.email = "breakoutegypt.com.us";
// business.payment_methods = "Cash";
// business.name = "Breakout";
// business.category = "Category";
// business.local.password = business.generateHash("1234");
// business.merchant_ID = "58e58a2508c8ea1c74180847";
// business.average_rating = 3.5;
// business.save(function(err){
// if(err) throw err;
// });

// var business = new Businesses();
// business.local.username = "Naaaame";
// business.description = "Business Description";
// business.area = "New Cairo";
// business.address = "The Ring Road, Taha Hussein St. South of The Police Academy 5th District, New Cairo, Egypt,Cairo Festival City, Cairo 11511, Egypt";
// business.phones = ["+20 16593"];
// business.email = "kidzaniacairo.com";
// business.payment_methods = "Cash";
// business.name = "KidZania Cairo";
// business.category = "Category";
// business.local.password = business.generateHash("1234");
// business.merchant_ID = "58e5879af89eb11bf0484519";
// business.average_rating = 5.0;
// business.save(function(err){
// if(err) throw err;
// });


// var Users = require('./app/models/RegisteredUser');

// var user = new Users();
// user.address = "address";
// user.birthdate = "1996-06-27T00:00:00.000Z";
// user.email = "salma.ammar@gmail.com";
// user.gender = "Female";
// user.local.password = user.generateHash("123");
// user.local.username = "salma.ammar";
// user.name = "Salma Ammar";
// user.phone = "+(20)1118954678";
// user.subscriptions = ["58f6b2cea97a083153a0d256", "58f6b43f5f77f0316cec84b3"];
// user.save();




// var Bookings = require('./app/models/Booking');

// var booking = new Bookings();
// booking.booking_date = "2016-06-27T00:00:00.000Z";
// booking.count = 2;
// booking.booker = "58f626120e95ef2ac66449d8";
// booking.event_id = "58f6b682be76ba318a514eed";
// booking.save();


// var booking = new Bookings();
// booking.booking_date = "2017-03-07T00:00:00.000Z";
// booking.count = 1;
// booking.booker = "58f626120e95ef2ac66449d8";
// booking.event_id = "58f6b63b6de3b9318503d160";
// booking.save();


// var Events = require('./app/models/Event').Events;

// var event = new Events();
// event.name = "Jump Your Breath Out";
// event.description = "The massive technology conference Techweek references past attendees and sponsors to illustrate how popular and illustrious the event is. If you don’t have big names to reference you can include testimonials and reviews from past attendees to create the same effect. One study showed that 79% of customers trust online reviews as much as personal recommendationzz.";
// event.location = "Cairo";
// event.capacity = "30";
// event.price = "100";
// event.repeated = "Once";
// event.business_id = "58f6b2cea97a083153a0d256";
// event.save();



// var event = new Events();
// event.name = "See the World";
// event.description = "The massive technology conference Techweek references past attendees and sponsors to illustrate how popular and illustrious the event is. If you don’t have big names to reference you can include testimonials and reviews from past attendees to create the same effect. One study showed that 79% of customers trust online reviews as much as personal recommendationz.";
// event.location = "Cairo";
// event.capacity = "30";
// event.price = "200";
// event.repeated = "Once";
// event.business_id = "58f6b43f5f77f0316cec84b3";
// event.save();


    // day: Date,
    // time: String,
    // available: Number,
    // bookings : [{type: mongoose.Schema.Types.ObjectId,ref: 'Booking',default: [] }],
    // event : {type: mongoose.Schema.Types.ObjectId, ref:'Events'},
    // facility_id  :{type: mongoose.Schema.Types.ObjectId, ref:'Facility'}



//var EventOccurrences = require('./app/models/EventOccurrences');
// var EventOccurrences = require('./app/models/Event').EventOccurrences;
// var event_occ = new EventOccurrences();
// event_occ.day = "2017-05-13T00:00:00.000Z";
// event_occ.time = "5:00pm"
// event_occ.available = 25;
// event_occ.event = "58f6b63b6de3b9318503d160";
// event_occ.save();








// var Facility = require('./app/models/Facility');

// var facility = new Facility();
// facility.name = "room1";
// facility.description = "facility description";
// facility.capacity = "10";
// facility.business_id = "58f0cb2d6bfb6061efd66625";
// facility.save();



// var Business = require('./app/models/Business');
//
// var business = new Business();
// business.local.username = "BreakOut";
// business.name = "BreakOut";
// business.merchant_ID = "111";
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

app.listen(config.port);



module.exports = app;
console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);
