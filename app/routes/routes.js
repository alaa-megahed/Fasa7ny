
var express  = require('express');
var app      = express();
var path 	 = require('path');

var booking    = require('../controllers/BookingsController');

module.exports = function(app)
{
	app.get('/', function(req, res){
        res.sendFile(path.resolve('app/views/test.html'));
    });

    app.post('/book_event', booking.book_event);

    app.post('/edit_booking',booking.edit_booking);

    app.post('/cancel_booking',booking.cancel_booking);

};