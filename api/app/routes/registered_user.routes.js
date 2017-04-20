var express  = require('express');
var app      = express();
var path 	 = require('path');
var router   = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'public/uploads/' });
var userController = require('../controllers/registered_user.controller.js');


var user   = require('../controllers/registered_user.controller');

router.use('/edit', function(req, res) {
  res.render('userEditInfo.ejs', {user:req.user});
});


router.get('/u/:id', userController.getUserDetails);
router.get('/bookings/:booking', userController.getBookingDetails);
router.get('/subs/:business_id', userController.getSubscribedBusiness);
router.get('/rate/:rate/:bid', user.addRating);
router.get('/subscribe/:id',user.subscribe);
router.get('/unsubscribe/:id',user.unsubscribe);
router.get('/customize', user.customize);
router.post('/editInfo/:userID', upload.single('img'), user.editInformation);


module.exports = router;
