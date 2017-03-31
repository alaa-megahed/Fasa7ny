
let AuthController = require('../controllers/AuthController');
var express = require('express'),
	router = express.Router();


router.get('/', AuthController.home);

router.get('/login', AuthController.getLogin);

router.post('/login', AuthController.postLogin);

router.get('/signup', AuthController.getSignup);

router.post('/signup', AuthController.postSignup);		

router.get('/profile', AuthController.getProfile);

router.get('/logout', AuthController.logout);	

app.get('/auth/facebook', AuthController.facebookLogin);

app.get('/auth/facebook/callback', AuthController.facebookCallback);
        