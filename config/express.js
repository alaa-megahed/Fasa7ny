var config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser'),
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
    //require('../app/routes/bookings.routes.js')(app, passport, multer);

    app.use( express.static("./uploads") );


    return app;
};
