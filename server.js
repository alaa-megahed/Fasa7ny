process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('./config/mongoose'),
    config   = require('./config/config'),
    express  = require('./config/express'),
    db       = mongoose(),
    app      = express();

var router = require('./app/routes/index.js');

//requiring Schemas
require('./app/models/Booking');
require('./app/models/Business');
require('./app/models/Event');
require('./app/models/Offer');
require('./app/models/RegisteredUser');

var WebAdmin = require('./app/models/WebAdmin');

// var webAdmin = new WebAdmin();

// 	webAdmin.local.username = "Nourhan";
//  	webAdmin.local.password = webAdmin.generateHash("Nourhan");

//  	webAdmin.save(function(err){
// 	if(err)
// 		throw err;
// });
// var Business = require('./app/models/Business');

// var business = new Business();
// business.local.username = "nounou";
// business.local.password = business.generateHash("nounou"); 
// business.save(function(err){
// if(err) throw err;
// });	

app.use(router);
app.listen(config.port);

module.exports = app;
console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);
