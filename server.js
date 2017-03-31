process.env.NODE_ENV = process.env.NODE_ENV || 'development';


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

require('./app/routes/routes.js')(app);

app.listen(config.port);

module.exports = app;
console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);
