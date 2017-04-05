var business = require('express').Router(); 
var businessController = require('../controllers/business.controller.js'); 
var path 	 = require('path');


business.get('/', function(req, res){
        res.sendFile(path.resolve('app/views/business.html'));
    });
business.get('/:name', businessController.getBusiness); 
business.post('/requestRemoval',businessController.requestRemoval)
business.post('/deletePaymentMethod', businessController.deletePaymentMethod);
business.post('/editInformation', businessController.editInformation);
business.post('/deletePhone', businessController.deletePhone);





module.exports = business; 
