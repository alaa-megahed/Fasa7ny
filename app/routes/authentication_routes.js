
let AuthController = require('../controllers/AuthController');
var express = require('express'),
	passport = require('passport'),
    router = express.Router();

var app = express();
router.get('/', AuthController.home);

router.get('/login', AuthController.getLogin);

router.post('/login', passport.authenticate('local-login', {successRedirect : '/profile',failureRedirect : '/login', failureFlash : true }));

router.get('/signup', AuthController.getSignup);

router.post('/signup', passport.authenticate('local-signup', {successRedirect : '/profile',failureRedirect : '/signup',failureFlash : true}));		

router.get('/profile', AuthController.getProfile);

router.get('/logout', AuthController.logout);	

router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

router.get('/auth/facebook/callback',passport.authenticate('facebook', {successRedirect : '/profile',failureRedirect : '/'}));
            						
            						
       							   


module.exports = router;        