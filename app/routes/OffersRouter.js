var express = require('express');
var multer = require('multer');
var router = express.Router();
var OffersController = require('../controllers/OffersController');
var BusinessController = require('../controllers/BusinessController');
var upload = multer({ dest: 'public/uploads/' });

//Offer routes
router.post('/createOffer', upload.single('image'), OffersController.createOffer);
router.post('/updateOffer', upload.single('image'), OffersController.updateOffer);
router.get('/deleteOffer', OffersController.deleteOffer);

//business routes
router.get('/publicPage', BusinessController.makePagePublic);

module.exports = router;
