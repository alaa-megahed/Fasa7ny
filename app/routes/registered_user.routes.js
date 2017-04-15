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


// router.get('/subscribe', function(req, res) {
//   res.render('subscribe.ejs');
// });


// router.get('/unsubscribe', function(req, res) {
//   res.render('unsubscribe.ejs');
// });


router.get('/rate', function(req, res) {
  res.render('rate.ejs');
});



router.get('/rate/:rate/:id', user.addRating);
router.get('/subscribe/:id',user.subscribe);
router.get('/unsubscribe/:id',user.unsubscribe);
router.get('/customize', user.customize);
router.post('/editInfo', upload.single('image'), user.editInformation);

module.exports = router;
