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


var router = require('./app/routes/RegisteredUserRouter.js');
app.use(router);

app.listen(config.port);

module.exports = app;
console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);
