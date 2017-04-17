var express  = require('express');
var app      = express();
var path 	 = require('path');
var router   = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'public/uploads/' });

var user   = require('../controllers/registered_user.controller');

router.use('/edit', function(req, res) {
  res.render('userEditInfo.ejs', {user:req.user});
});


router.get('/subscribe', function(req, res) {
  res.render('subscribe.ejs');
});


router.get('/unsubscribe', function(req, res) {
  res.render('unsubscribe.ejs');
});


router.get('/rate', function(req, res) {
  res.render('rate.ejs');
});



router.post('/rate', user.addRating);
router.post('/subscribe',user.subscribe);
router.post('/unsubscribe',user.unsubscribe);
router.get('/customize', user.customize);
router.post('/editInfo', upload.single('image'), user.editInformation);

router.get('/resetUnread', user.resetUnread);

module.exports = router;
