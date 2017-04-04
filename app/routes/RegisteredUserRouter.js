var express  = require('express');
var app      = express();
var path 	 = require('path');
var router   = express.Router();

var user   = require('../controllers/RegisteredUserController');

router.post('/rate', user.addRating);
router.post('/subscribe',user.subscribe);
router.post('/unsubscribe',user.unsubscribe);
router.post('/customize', user.customize);

module.exports = router;
