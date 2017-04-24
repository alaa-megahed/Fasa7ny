var express  = require('express');
var app      = express();
var path 	 = require('path');
var router   = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'public/uploads/' });


var user   = require('../controllers/registered_user.controller');


router.get('/u/:id', user.getUserDetails);
router.get('/bookings/:booking', user.getBookingDetails);
router.get('/subs/:business_id', user.getSubscribedBusiness);
router.get('/rate/:rate/:bid', user.addRating);
router.get('/subscribe/:id',user.subscribe);
router.get('/unsubscribe/:id',user.unsubscribe);
// router.get('/customize', user.customize);
router.post('/editInfo/:userID', upload.single('img'), user.editInformation);
router.get('/resetUnread', user.resetUnread);

module.exports = router;
