
let AuthController = require('../controllers/auth.controller');
var express = require('express'),
    router = express.Router();

var app = express();

router.get('/', AuthController.home);

router.get('/failLogIn', AuthController.getLoginFail);

router.get('/successLogIn', AuthController.getLoginSuccess);

router.post('/login', AuthController.postLogin);

router.get('/failSignUp', AuthController.getSignupFail);

router.get('/successSignUp', AuthController.getSignupSuccess);

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


module.exports = router;
