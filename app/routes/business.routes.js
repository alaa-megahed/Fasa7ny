var business = require('express').Router(); 
var businessController = require('../controllers/business.controller.js'); 

business.get('/:name', businessController.getBusiness); 
business.post('/haga', businessController.deletePaymentMethod);
business.post('/hagat', businessController.editInformation);


module.exports = business; 
