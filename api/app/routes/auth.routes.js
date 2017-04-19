
let AuthController = require('../controllers/auth.controller');
var express = require('express'),
    router = express.Router();

var app = express();

router.get('/', AuthController.home);

router.get('/login', AuthController.getLogin);

router.post('/login', AuthController.postLogin);

router.get('/signup', AuthController.getSignup);

router.post('/signup', AuthController.postSignup);		

router.get('/profile', AuthController.getProfile);

router.get('/logout', AuthController.logout);	

router.get('/facebook', AuthController.facebookLogin);

router.get('/facebook/callback',AuthController.facebookCallback);

router.get('/google', AuthController.googleLogin);
                    
router.get('/google/callback', AuthController.googleCallback);

router.get('/forgot',AuthController.getForgetPassword);        

router.post('/forgot',AuthController.forgotPassword);        

router.get('/reset/:token', AuthController.getReset);           

router.post('/reset/:token',AuthController.postReset);                  							   

router.get('/getStripePK', AuthController.getStripePK);

module.exports = router;        