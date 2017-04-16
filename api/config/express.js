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
multer = require('multer'),
    path = require('path');



module.exports = function () {
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



    app.set('views', './app/views');
    app.set('view engine', 'ejs');
    console.log(path.join(__dirname, '..')); 
    app.use(express.static("public"));
    app.all('/*', function (req, res, next) {
        // Just send the index.html for other files to support HTML5Mode. Assuming your index.html is at application root
        res.sendFile('public/views/index.html', {root: path.join(__dirname, '..')});
    });

    // app.use(express.static("./uploads"));
    //STATE HERE THE ROUTES YOU REQUIRE, EXAMPLE:
    //require('../app/routes/users.server.routes.js')(app, passport, multer);

    var router = require('../app/routes');

    app.use(router);



    require('./passport')(passport);                                     // pass passport for passport configuration



    //setting up static files 
    // app.use('/scripts', express.static(path.resolve('node_modules')));
    


    return app;
};
