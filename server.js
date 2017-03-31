process.env.NODE_ENV = process.env.NODE_ENV || 'development';


var mongoose = require('./config/mongoose');
    config = require('./config/config'),
    express = require('./config/express'),
    passport = require('passport'),
    db = mongoose(),
    app = express();




require('./config/passport')(passport); // pass passport for configuration

/**
	App Configuration
 */
app.use(express.cookieParser()); // read cookies (needed for auth)
app.use(express.bodyParser()); // get information from html forms
// required for passport
app.use(express.session({ secret: 'farfeshnyyabeblawy' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session




app.listen(config.port);

module.exports = app;
console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);
