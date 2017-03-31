var config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    flash = require('connect-flash'),
    session = require('express-session'),
    multer = require('multer');



module.exports = function() {
    var app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(express.bodyParser()); // get information from html forms
    app.use(express.cookieParser()); // read cookies (needed for auth)

    app.use(flash());

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: 'OurSuperSecretCookieSecret'
    }));

    app.use(passport.initialize());
    app.use(passport.session());







    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    //STATE HERE THE ROUTES YOU REQUIRE, EXAMPLE:
    //require('../app/routes/users.server.routes.js')(app, passport, multer);
    require('./passport')(passport);                                 // pass passport for passport configuration
    require('../app/routes/authentication_routes');   // authentication related routes

    app.use( express.static("./uploads") );

  

    return app;
};
