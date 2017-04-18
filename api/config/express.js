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

    require('./passport')(passport);


    app.use(passport.initialize());
    app.use(passport.session());



    app.set('views', '../angular/views');
    app.set('view engine', 'ejs');

    //STATE HERE THE ROUTES YOU REQUIRE, EXAMPLE:
    //require('../app/routes/users.server.routes.js')(app, passport, multer);

    app.use('*',function(req, res, next){
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Contro-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization, Accept, X-HTTP-Method-Override");
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });



    // app.use(function(req, res, next) {
    // res.header('Access-Control-Allow-Origin', req.headers.origin);
    // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    // res.header('Access-Control-Allow-Credentials', true);
    // if ('OPTIONS' == req.method) {
    //      res.send(200);
    //  } else {
    //      next();
    //  }
    // });

    var router = require('../app/routes');

    app.use(router);



                                // pass passport for passport configuration

    app.use( express.static("../angular") );
    app.use( express.static("./uploads") );


    return app;
};
