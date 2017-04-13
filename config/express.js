var config = require('./config'),
    express = require('express'),
    http = require('http'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    flash = require('connect-flash'),
    session = require('express-session'),
    schedule = require('node-schedule'),
    async = require('async');
    multer = require('multer');



module.exports = function() {
    var app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // app.use(bodyParser()); // get information from html forms
    app.use(cookieParser()); // read cookies (needed for auth)

    app.use(flash());

    app.use(session({
        saveUninitialized: true,
        resave: false,        
        secret: 'OurSuperSecretCookieSecret'
    }));

    app.use(passport.initialize());
    app.use(passport.session());



    app.set('views', 'public/views');
    app.set('view engine', 'ejs');

    //STATE HERE THE ROUTES YOU REQUIRE, EXAMPLE:
    //require('../app/routes/users.server.routes.js')(app, passport, multer);

    var router = require('../app/routes');

    app.use(router); 

    

    require('./passport')(passport);                                     // pass passport for passport configuration

    app.use( express.static("./public") );
    app.use( express.static("./uploads") );


    return app;
};
