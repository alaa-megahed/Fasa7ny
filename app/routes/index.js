var express = require('express');
var router = express.Router();
var search = require('./search.routes.js');
var business = require('./business.routes.js');
var bookings = require('./bookings.routes');
var reviews = require('./reviews.routes');
var offers = require('./offers.routes');
var event = require('./event.routes');

router.use('/event', event);
router.use('/offers', offers);
router.use('/reviews', reviews);
router.use('/bookings', bookings);
router.use('/search', search);
router.use('/business', business);
router.use('/contact', function(req, res) {
    res.send('Contact us with a business proposal at fasa7ny@gmail.com');
});
router.get('/', function (req, res) {
    res.send("Hello");
});

module.exports = router;
