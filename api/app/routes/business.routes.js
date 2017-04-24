
var business = require('express').Router();
var businessController = require('../controllers/business.controller.js');
var statsController = require('../controllers/stats.controller.js');

var path 	 = require('path');
var multer = require('multer');
var upload = multer({ dest: 'public/uploads/' });




// business.get('/b/:id', businessController.getBusiness);

business.get('/b/:name', businessController.getBusiness);
business.post('/getBusinessId',businessController.getBusinessId);
business.get('/requestRemoval',businessController.requestRemoval)
business.get('/deletePaymentMethod/:method', businessController.deletePaymentMethod);
business.post('/editInformation', upload.single('img'), businessController.editInformation);
business.get('/deletePhone/:phone', businessController.deletePhone);
business.get('/publicPage', businessController.makePagePublic);
business.get('/deleteImage/:image', businessController.deleteImage);

business.get('/hasBookings', businessController.hasBookings);
business.get('/getEventOccs/:event', businessController.getEventOccs);
business.get('/getFacilityOccs/:facility', businessController.getFacilityOccs);
business.get('/getBooking/:booking', businessController.getBooking);

business.post('/changeImage', upload.single('img'), businessController.changeImage);

// business.get('/checkSession', businessController.checkSession);




module.exports = business;
