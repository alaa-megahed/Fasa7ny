process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var WebAdmin = require('./app/models/WebAdmin');
var mongoose = require('./config/mongoose'),
    config   = require('./config/config'),
    express  = require('./config/express'),
    db       = mongoose(),

    app      = express(),
    cors     = require('cors');

app.listen(config.port);


// var admin = new WebAdmin();
// admin.local.username = "radwa";
// admin.local.password = admin.generateHash("1234");
// admin.save(
//   function(err)
//     {if(err) throw err;}
// );

// var RegUser = require('./app/models/RegisteredUser'); 
// var user = new RegUser(); 
// user.name = 'Radwa'; 
// user.save(); 

var Rating = require('./app/models/Rating'); 

var rate = new Rating(); 


// var Events = require('./app/models/Event').Events;

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
// facility.business_id = "58f7693c51294567b2d8b083";
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


module.exports = app;
console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);
