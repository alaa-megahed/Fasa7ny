var express = require('express');
var router = express.Router();
var search = require('./search.routes.js');
var business = require('./business.routes.js');
var bookings = require('./bookings.routes');
var path = require('path');
var fs = require('fs');
var reviews = require('./reviews.routes');
var offers = require('./offers.routes');
var event = require('./event.routes');
var reviews = require('./reviews.routes');
var offers = require('./offers.routes');
var event = require('./event.routes');
var auth = require('./auth.routes');
var user = require('./registered_user.routes');
var admin = require('./web_admin.routes');

var stats = require('./stats.routes');
var path = require('path');
var stats = require('./stats.routes');
router.use('/auth', auth);
router.use('/event', event);
router.use('/offers', offers);
router.use('/reviews', reviews);
router.use('/bookings', bookings);
router.use('/search', search);
router.use('/business', business);
router.use('/user', user);
router.use('/admin', admin);
router.use('/stats', stats);


router.use('/contact', function (req, res) {
    res.send('Contact us with a business proposal at fasa7ny@gmail.com');
});


//check if photo exists, send it, if not, send defult avatar 
router.use('/photo/:photo', function (req, res) {
    
    res.sendFile(path.resolve('public/uploads/' + req.params.photo));

});


router.get('/loggedin', function (req, res) {

    res.json(req.user);
});

router.get('/loggedin1', function (req1, res1) {
    res1.json(req1.user);
});
router.use('/stats', stats);



//function to check if file exists 
var fileExists = function (filePath) {
    try {
        return fs.statSync(filePath).isFile();
    }
    catch (err) {
        return false;
    }
}

module.exports = router;
