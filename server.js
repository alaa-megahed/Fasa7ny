process.env.NODE_ENV = process.env.NODE_ENV || 'development';

<<<<<<< HEAD

var mongoose = require('./config/mongoose'),
    config   = require('./config/config'),
    express  = require('./config/express'),
    passport = require('passport'),//this was ./config/passport where passport.js had serialize and deserialize user, sould be updated when that file is done.
    db       = mongoose(),
    bodyParser  = require('body-parser'),
// passport  = passport(),
    app      = express();


//requiring Schemas
require('./app/models/Booking');
require('./app/models/Business');
require('./app/models/Event');
require('./app/models/Offer');
require('./app/models/RegisteredUser');
require('./app/models/WebAdmin');

var router = require('./app/routes/BookingsRouter.js');
app.use(router); 
=======
var mongoose = require('./config/mongoose');
    config = require('./config/config'),
    express = require('./config/express'),
    passport = require('passport'),//this was ./config/passport where passport.js had serialize and deserialize user, sould be updated when that file is done.
    db = mongoose(),
  //  passport = passport(),
    app = express(),
    schedule = require('node-schedule'),
    async = require('async');


//require('./app/routes/routes')(app,schedule,async); 
require('./app/models/Event');  
require('./app/models/Business');
require('./app/controllers/RegularEventController'); 
require('./app/controllers/BusinessController');

var router = require('./app/routes/EventRouter.js')
app.use(router);
>>>>>>> events

app.listen(config.port);

//module.exports = app;
console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);

