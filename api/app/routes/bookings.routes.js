

var express  = require('express');
var app      = express();
var path 	 = require('path');
var router   = express.Router();

var booking    = require('../controllers/bookings.controller');
var payment    = require('../controllers/payment.controller');


    //below belongs to business
    router.get('/', function(req, res){
        if(req.user && req.user.user_type == 2)
             res.render(path.resolve('app/views/test2.ejs'));
         else
         {
            res.send("You Are Not Authorized To Access This Page!");
         }
    });

    router.post('/book_event', booking.book_event);

    router.post('/edit_booking',booking.edit_booking);

    router.post('/cancel_booking',booking.cancel_booking);

    router.get('/view_event_bookings/:event_id',booking.view_event_bookings);
    router.post('/cancel_booking_after_delete', booking.cancel_booking_after_delete);

    //below belongs to RegisteredUser

    router.get('/regusers', function(req, res){
        res.sendFile(path.resolve('app/views/regusersbookingtest.html'));
    });

    router.post('/charge', payment.pay);

    router.post('/refund', payment.refund);

    router.post('/get_booking', booking.getBooking);

    router.post('/createRegUserBookings', booking.regUserAddBooking);

    router.post('/viewRegUserBookings', booking.regUserViewBookings);

    router.post('/deleteRegUserBookings', booking.regUserDeleteBookings);

    router.post('/editRegUserBookings', booking.regUserEditBookings);

module.exports = router;
