var express  = require('express');
var app      = express();
var path 	 = require('path');
var router   = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'public/uploads/' });

var user   = require('../controllers/RegisteredUserController');

router.use('/edit', function(req, res) {
  res.render('userEditInfo.ejs');
});

router.post('/rate', user.addRating);
router.post('/subscribe',user.subscribe);
router.post('/unsubscribe',user.unsubscribe);
router.post('/customize', user.customize);
router.post('/editInfo', upload.single('image'), user.editInformation);

module.exports = router;
